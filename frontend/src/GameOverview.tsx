import React, { useState, useEffect } from "react";

type Team = {
  id: number;
  full_name: string;
  abbreviation: string;
};

type GameOverviewResponse = {
  ppg_team1: number;
  ppg_team2: number;
  expected_total: number;
  games_played_team1: number;
  games_played_team2: number;
  note: string;
};

const GameOverview: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [data, setData] = useState<GameOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/teams")
      .then((res) => res.json())
      .then((list) =>
        setTeams(
          list.map((t: any) => ({
            id: t.id,
            full_name: t.full_name,
            abbreviation: t.abbreviation,
          }))
        )
      );
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    const params = new URLSearchParams({ team1, team2 });
    const res = await fetch(`http://127.0.0.1:8000/game/overview?${params}`);
    setData(await res.json());
    setLoading(false);
  };

  const logo = (abbr: string) =>
    `https://a.espncdn.com/i/teamlogos/nba/500/${abbr.toLowerCase()}.png`;

  return (
    <div className="card">
      <h2 className="card-title">Game Overview</h2>
      <p className="card-caption">Select two teams to compare scoring averages.</p>

      <div className="team-select-row">
        <div className="team-picker">
          <select
            className="input"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
          >
            <option value="">Select Team 1</option>
            {teams.map((team) => (
              <option key={team.id} value={team.full_name}>
                {team.full_name}
              </option>
            ))}
          </select>
          {team1 && (
            <img className="team-logo" src={logo(teams.find(t => t.full_name === team1)!.abbreviation)} alt="logo" />
          )}
        </div>

        <div className="team-picker">
          <select
            className="input"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
          >
            <option value="">Select Team 2</option>
            {teams.map((team) => (
              <option key={team.id} value={team.full_name}>
                {team.full_name}
              </option>
            ))}
          </select>
          {team2 && (
            <img className="team-logo" src={logo(teams.find(t => t.full_name === team2)!.abbreviation)} alt="logo" />
          )}
        </div>

        <button
          className="primary-btn"
          onClick={fetchOverview}
          disabled={loading || !team1 || !team2}
        >
          {loading ? "Loading..." : "Get Overview"}
        </button>
      </div>

      {data && (
        <div className="stat-card">
          <h3>Season Scoring Summary</h3>
          <p><strong>{team1}:</strong> {data.ppg_team1} PPG</p>
          <p><strong>{team2}:</strong> {data.ppg_team2} PPG</p>
          <p>
            Projected total if they played today:{" "}
            <strong>{data.expected_total}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default GameOverview;
