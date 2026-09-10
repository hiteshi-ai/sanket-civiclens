import { useState } from "react";
import { CitizenReportPage } from "./pages/CitizenReportPage";
import { MunicipalDashboardPage } from "./pages/MunicipalDashboardPage";

type View = "citizen" | "municipal";

export default function App() {
  const [view, setView] = useState<View>(
    window.location.hash === "#municipal" ? "municipal" : "citizen",
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Civic infrastructure intelligence</p>
            <h1>SANKET <span>×</span> CivicLens</h1>
          </div>
        </div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button
            className={view === "citizen" ? "nav-button active" : "nav-button"}
            onClick={() => setView("citizen")}
          >
            Report an issue
          </button>
          <button
            className={view === "municipal" ? "nav-button active" : "nav-button"}
            onClick={() => setView("municipal")}
          >
            Municipal dashboard
          </button>
        </nav>
      </header>

      <main className="page-content">
        {view === "citizen" ? <CitizenReportPage /> : <MunicipalDashboardPage />}
      </main>

      <footer className="site-footer">
        <span>Chandigarh, India</span>
        <span>Every report is a signal. Together, they reveal the real problem.</span>
      </footer>
    </div>
  );
}