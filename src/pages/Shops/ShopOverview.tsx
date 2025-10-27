import { useEffect, useState } from "react";
import type { GetShopOverviewResponse } from "../../types/shop";
import { getShopOverview } from "../../api/shop";
import { useShop } from "../../context/ShopContext";
import "./ShopOverview.css";

export default function ShopOverview() {
  const { activeShop } = useShop();
  const [data, setData] = useState<GetShopOverviewResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dummyBookings = [
    {
      id: "demo1",
      clientName: "John Papadopoulos",
      serviceName: "Men’s Haircut",
      date: new Date().toISOString(),
      status: "Completed",
    },
    {
      id: "demo2",
      clientName: "Maria Nikolaou",
      serviceName: "Hair Coloring",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "Completed",
    },
    {
      id: "demo3",
      clientName: "Alexandros K.",
      serviceName: "Beard Trim",
      date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      status: "Cancelled",
    },
    {
      id: "demo4",
      clientName: "Sofia Theodorou",
      serviceName: "Highlights",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: "Upcoming",
    },
  ];
  useEffect(() => {
    if (!activeShop?.id) return;
    (async () => {
      try {
        const res = await getShopOverview(activeShop.id);
        setData(res.data ?? null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeShop?.id]);

  if (loading) return <div className="shop-overview"><p>Loading shop overview...</p></div>;
  if (error) return <div className="shop-overview error"><p>Error: {error}</p></div>;
  if (!data) return <div className="shop-overview"><p>No data available.</p></div>;

  const { shop, totalBookings, activeServices, teamMembers, monthlyRevenue, recentBookings } = data;

  return (
    <div className="shop-overview">
      <header className="shop-header">
        <h1>{shop.name}</h1>
        <p className="shop-meta">
          <span>ID: {shop.id}</span> • 
          <span>Owner #{shop.ownerId}</span> • 
          <span>Created {new Date(shop.createdAt).toLocaleDateString()}</span>
        </p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Active Services</h3>
          <p className="stat-value">{activeServices}</p>
        </div>
        <div className="stat-card">
          <h3>Team Members</h3>
          <p className="stat-value">{teamMembers}</p>
        </div>
        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <p className="stat-value">€{monthlyRevenue.toFixed(2)}</p>
        </div>
      </section>

      <section className="recent-bookings">
        <h2>Recent Bookings</h2>
        {dummyBookings.length === 0 ? (
          <p className="empty">No recent bookings yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.clientName}</td>
                  <td>{b.serviceName}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
