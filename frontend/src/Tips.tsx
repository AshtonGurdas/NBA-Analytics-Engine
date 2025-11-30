import { FaBasketballBall } from "react-icons/fa";
import { GiTargetArrows } from "react-icons/gi";
import { MdTimer } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

export default function Tips() {
  return (
    <div className="card">
      <h2 className="card-title">Analytics Education</h2>
      <p className="card-caption">Learn how to analyze real performance data</p>

      {/* USG% */}
      <div className="tip-section">
        <div className="tip-header">
          <FaBasketballBall className="tip-icon" />
          <h3>USG% — Usage Rate</h3>
        </div>
        <p>
          Usage Rate estimates how much of the team’s offense runs through a player
          while they’re on the court (FGA + FTA + TO).
        </p>

        <div className="bar-container">
          <div className="bar usg-bar"></div>
        </div>

        <ul className="tip-list">
          <li>Below 15% — Role player / defensive specialist</li>
          <li>15–20% — Moderate involvement</li>
          <li>20–30% — Primary scorer / offensive leader</li>
          <li>30%+ — Superstar level involvement</li>
        </ul>
      </div>

      {/* TS% */}
      <div className="tip-section">
        <div className="tip-header">
          <GiTargetArrows className="tip-icon" />
          <h3>TS% — True Shooting Efficiency</h3>
        </div>
        <p>Measures overall scoring efficiency including 2s, 3s & free throws.</p>

        <div className="bar-container">
          <div className="bar ts-bar"></div>
        </div>

        <ul className="tip-list">
          <li>Below 50% — Poor</li>
          <li>50–55% — Below average</li>
          <li>55–58% — League average</li>
          <li>58–60% — Good</li>
          <li>60–65% — Very good</li>
          <li>65%+ — Exceptional</li>
        </ul>
      </div>

      {/* Minutes */}
      <div className="tip-section">
        <div className="tip-header">
          <MdTimer className="tip-icon" />
          <h3>Minutes Matter</h3>
        </div>
        <p>More minutes = more opportunities for stats across categories.</p>

        <div className="bar-container">
          <div className="bar minutes-bar"></div>
        </div>
      </div>

      {/* Net Rating */}
      <div className="tip-section">
        <div className="tip-header">
          <FaChartLine className="tip-icon" />
          <h3>Net Rating</h3>
        </div>
        <p>Point differential per 100 possessions — shows team strength.</p>

        <div className="bar-container">
          <div className="bar net-bar"></div>
        </div>

        <ul className="tip-list">
          <li>+5.0 — Very good</li>
          <li>+7.0+ — Elite / championship level</li>
        </ul>
      </div>
    </div>
  );
}
