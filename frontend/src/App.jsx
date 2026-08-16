import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="app-shell">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar-column">
        <Sidebar />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-column">

        <Topbar />

        <main className="page-content">
          <Dashboard />
        </main>

      </div>

    </div>
  );
}

export default App;