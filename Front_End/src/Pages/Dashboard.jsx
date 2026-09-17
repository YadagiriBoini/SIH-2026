import Navbar from "../Components/Navbar";
import InputPanel from "../Components/InputPanel";
import MapView from "../Components/MapView";
import SpillInfo from "../Components/SpillInfo";
import VesselTable from "../Components/VesselTable";
import AttributionChart from "../Components/AttributionChart";
import SHAPExplanation from "../Components/SHAPExplanation";

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-container">

        <InputPanel />

        <SpillInfo />

        <MapView />

        <div className="results-grid">
          <VesselTable />
          <AttributionChart />
        </div>

        <SHAPExplanation />

      </main>
    </div>
  );
}

export default Dashboard;