import "./ShopOverview.css";
import { useShop } from "../../context/ShopContext";
  
export default function ShopOverview() {

const { selectedShop } = useShop();


  // Example mock data — replace later with API calls
  const shopStats = {
    totalBookings: 142,
    activeServices: 12,
    teamMembers: 4,
    monthlyRevenue: "€4,250",
  };

  return (
    <div className="shop-overview">
      <header className="shop-header">
        <h1>Shop Overview</h1>
        <p className="subtitle">Shop ID: {selectedShop?.id}</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{shopStats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{shopStats.activeServices}</div>
          <div className="stat-label">Active Services</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{shopStats.teamMembers}</div>
          <div className="stat-label">Team Members</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{shopStats.monthlyRevenue}</div>
          <div className="stat-label">Monthly Revenue</div>
        </div>
      </section>

      <section className="recent-section">
        <h2>Recent Bookings</h2>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Barber</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith</td>
              <td>Haircut</td>
              <td>Alex</td>
              <td>12 Oct 2025</td>
              <td><span className="status confirmed">Confirmed</span></td>
            </tr>
            <tr>
              <td>Maria Papadopoulou</td>
              <td>Beard Trim</td>
              <td>Nikos</td>
              <td>11 Oct 2025</td>
              <td><span className="status pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
