import { useState } from "react";
import PlayerProjection from "./PlayerProjection";
import SearchPlayer from "./SearchPlayer";
import HitRate from "./HitRate";
import GameOverview from "./GameOverview";
import "./App.css";

type TabId = "search" | "projection" | "hitrate" | "overview";

const tabs: { id: TabId; label: string }[] = [
  { id: "search", label: "Player Search" },
  { id: "projection", label: "Projection" },
  { id: "hitrate", label: "Hit Rate" },
  { id: "overview", label: "Game Overview" },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("search");

  const renderTab = () => {
    switch (activeTab) {
      case "search":
        return <SearchPlayer />;
      case "projection":
        return <PlayerProjection />;
      case "hitrate":
        return <HitRate />;
      case "overview":
        return <GameOverview />;
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title">
          <span className="logo-dot" />
          <span>NBA Analytics Engine</span>
        </div>
        <p className="app-subtitle">
          Pure data. No picks. You decide.
        </p>
      </header>

      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${
              activeTab === tab.id ? "tab-btn-active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">{renderTab()}</main>
    </div>
  );
}

export default App;
