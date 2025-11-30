import React, { useState } from "react";

type GameOverviewResponse = {
  ppg_team1: number;
  ppg_team2: number;
  expected_total: number;
  games_played_team1: number;
  games_played_team2: number;
  note: string;
};

const GameOverview: React.FC = () => {
  const [team1, setTeam1] = useState("Phoenix Suns");
  const [team2, setTeam2] = useState("Denver Nuggets");
  const [data, setData] = useState<GameOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const params = new URLSearchParams({ team1, team2 });
      const res = await fetch(`http://127.0.0.1:8000/game/overview?${params.toString()}`);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error fetching overview");
      }

      const json: GameOverviewResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Game Overview</h2>
      <p className="card-caption">
        Season scoring averages + projected combined total.
      </p>

      <div className="form-row">
        <div className="form-field grow">
          <label>Team 1</label>
          <input
            type="text"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            placeholder="e.g. Phoenix Suns"
          />
        </div>
        <div className="form-field grow">
          <label>Team 2</label>
          <input
            type="text"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            placeholder="e.g. Denver Nuggets"
          />
        </div>
        <button className="primary-btn" onClick={fetchOverview} disabled={loading}>
          {loading ? "Loading..." : "Get Overview"}
        </button>
      </div>

      {error && <p className="error-text">⚠ {error}</p>}

      {data && (
        <div className="stat-card" style={{ marginTop: "1rem" }}>
          <h3>Season Scoring Summary</h3>
          <p><strong>{team1}</strong>: {data.ppg_team1} PPG • {data.games_played_team1} games</p>
          <p><strong>{team2}</strong>: {data.ppg_team2} PPG • {data.games_played_team2} games</p>
          <p>Projected combined total: <strong>{data.expected_total}</strong></p>
          <p className="meta-text">{data.note}</p>
        </div>
      )}
    </div>
  );
};

export default GameOverview;
