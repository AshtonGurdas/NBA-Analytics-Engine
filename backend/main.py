from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.endpoints import leaguedashteamstats, playergamelog
from nba_api.stats.static import players, teams
from functools import lru_cache
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SEASON_DEFAULT = "2025-26"


@app.get("/teams")
def get_teams():
    return teams.get_teams()


@app.get("/player/search")
def player_search(name: str):
    result = [p for p in players.get_players() if name.lower() in p["full_name"].lower()]
    if not result:
        raise HTTPException(status_code=404, detail="No player found.")
    return result


@app.get("/player/projection")
def player_projection(player_id: int, season: str = SEASON_DEFAULT):
    try:
        logs = playergamelog.PlayerGameLog(
            player_id=player_id, season=season
        ).get_data_frames()[0]
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"NBA stats error for projection: {e}",
        )

    if logs.empty:
        raise HTTPException(status_code=404, detail="No games found for projection")

    def calc_stat(col: str):
        if col not in logs.columns:
            raise HTTPException(status_code=400, detail=f"Stat column not found: {col}")

        season_avg = float(logs[col].mean())
        last5_avg = float(logs[col].head(5).mean())
        proj = 0.6 * season_avg + 0.4 * last5_avg
        return {
            "season_avg": round(season_avg, 1),
            "last5_avg": round(last5_avg, 1),
            "projection": round(proj, 1),
            "range_low": round(proj - 2, 1),
            "range_high": round(proj + 2, 1),
        }

    return {
        "player_id": player_id,
        "games_played": len(logs),
        "season": season,
        "stats": {
            "points": calc_stat("PTS"),
            "assists": calc_stat("AST"),
            "rebounds": calc_stat("REB"),
            "threes_made": calc_stat("FG3M"),
            "minutes": calc_stat("MIN"),
        },
    }


@app.get("/player/hitrate")
@app.get("/hitrate")
def hit_rate(
    player_id: int,
    stat: str,
    line: Optional[float] = None,
    target: Optional[float] = None,
    season: str = SEASON_DEFAULT,
):
    threshold = line if line is not None else target
    if threshold is None:
        raise HTTPException(status_code=400, detail="Provide line or target parameter")

    try:
        logs = playergamelog.PlayerGameLog(player_id=player_id, season=season).get_data_frames()[0]
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"NBA logs error: {e}",
        )

    if logs.empty:
        raise HTTPException(status_code=404, detail="No logs available")

    col = stat.upper()
    if col not in logs.columns:
        raise HTTPException(status_code=400, detail=f"Invalid stat column: {col}")

    games = len(logs[col])
    over_games = int((logs[col] >= float(threshold)).sum())
    under_games = games - over_games
    pct = (over_games / games) * 100 if games else 0

    return {
        "games": games,
        "over_games": over_games,
        "under_games": under_games,
        "hit_rate": f"{pct:.1f}%",
    }


@app.get("/game/overview")
def game_overview(team1: str, team2: str, season: str = SEASON_DEFAULT):
    try:
        stats = leaguedashteamstats.LeagueDashTeamStats(season=season).get_data_frames()[0]
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"NBA stats error: {e}",
        )

    if stats.empty:
        raise HTTPException(status_code=404, detail=f"No data for season {season}")

    t1 = stats[stats["TEAM_NAME"].str.lower() == team1.lower()]
    t2 = stats[stats["TEAM_NAME"].str.lower() == team2.lower()]

    if t1.empty or t2.empty:
        raise HTTPException(status_code=404, detail="Team not found")

    t1 = t1.iloc[0]
    t2 = t2.iloc[0]

    ppg1 = float(t1["PTS"]) / int(t1["GP"])
    ppg2 = float(t2["PTS"]) / int(t2["GP"])
    expected_total = ppg1 + ppg2

    return {
        "ppg_team1": round(ppg1, 1),
        "ppg_team2": round(ppg2, 1),
        "expected_total": round(expected_total, 1),
        "games_played_team1": int(t1["GP"]),
        "games_played_team2": int(t2["GP"]),
        "note": "Average points per game + expected total if these teams met today.",
    }
