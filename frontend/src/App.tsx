import { useState } from "react";
import PlayerProjection from "./PlayerProjection";
import SearchPlayer from "./SearchPlayer";
import HitRate from "./HitRate";
import GameOverview from "./GameOverview";
import Tips from "./Tips";
import "./App.css";

type TabId = "search" | "projection" | "hitrate" | "overview" | "tips";

const tabs: { id: TabId; label: string }[] = [
  { id: "search", label: "Player Search" },
  { id: "projection", label: "Projections" },
  { id: "hitrate", label: "Hit Rate" },
  { id: "overview", label: "Game Overview" },
  { id: "tips", label: "Tips / Education" },
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
      case "tips":
        return <Tips />;
      default:
        return null;
    }
  };

  return (
    <div className="container app-root">
      <header className="app-header">
        <h1>NBA Analytics Engine</h1>
        <p className="app-subtitle">Smart basketball insights powered by real data.</p>
      </header>

      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "tab-btn-active" : ""}`}
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
