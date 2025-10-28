import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllShops } from "../../api/shop";
import type { ShopWithRoleDTO } from "../../types/shop";
import "./AllShops.css";
import { useShop } from "../../context/ShopContext";

export default function AllShops() {
  const [shops, setShops] = useState<ShopWithRoleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { selectShop } = useShop()

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllShops();
        console.log(data);
        setShops(data);         
      } catch (err) {
        console.error(err);
        setError("Failed to load shops.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  

  const total = shops.length;
  const activeCount = shops.filter((s) => s.active !== false).length;
  const inactiveCount = total - activeCount;

  const goToShop = (s: ShopWithRoleDTO) => {
    selectShop({ id: s.id, name: s.name, role: s.role });
    navigate(`/shops/${encodeURIComponent(s.name)}/overview`);
  };

  if (loading)
    return (
      <div className="shops-page">
        <p>Loading shops…</p>
      </div>
    );

  if (error)
    return (
      <div className="shops-page error">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="shops-page">
      {/* === HEADER === */}
      <header className="shops-header">
        <h1>My Shops</h1>
        <button
          className="btn primary"
          onClick={() => navigate("/shops/create")}
        >
          + Create Shop
        </button>
      </header>

      {/* === STATS === */}
      <section className="shops-stats">
        <div className="stat-card">
          <h3>Total Shops</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p className="active">{activeCount}</p>
        </div>
        <div className="stat-card">
          <h3>Inactive</h3>
          <p className="inactive">{inactiveCount}</p>
        </div>
      </section>

      {/* === TABLE === */}
      <section className="shops-table">
        <table>
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Address</th>
              <th>Owner ID</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shops.length ? (
              shops.map((s) => (
                <tr key={s.id} className="row" onClick={() => goToShop(s)}>
                  <td>
                    <div className="shop-name-cell">
                      <div className="avatar">{initials(s.name)}</div>
                      <span className="name">{s.name}</span>
                    </div>
                  </td>
                  <td>{s.address || "—"}</td>
                  <td>#{s.ownerId}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString("en-GB")}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        s.active === false ? "inactive" : "active"
                      }`}
                    >
                      {s.active === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty">
                  No shops found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function initials(name?: string) {
  if (!name) return "S";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "S";
}
