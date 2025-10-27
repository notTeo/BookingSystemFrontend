import "./Overview.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import type { UserDTO } from "../../types/user";
import { useShop } from "../../context/ShopContext";

type OutletContextType = { user: UserDTO };

export default function Overview() {
  const { user } = useOutletContext<OutletContextType>();
  const { selectShop } = useShop();
  const navigate = useNavigate();

  const initials =
    user.name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "U";

  const totalShops = user.shops?.length ?? 0;
  const plan = user.subscription || "MEMBER";

  return (
    <div className="user-overview">
      {/* === HEADER === */}
      <header className="user-header">
        <div className="avatar">{initials}</div>
        <div className="info">
          <h1>{user.name}</h1>
          <p className="email">{user.email}</p>
          <span className={`plan-badge plan-${plan.toLowerCase()}`}>
            {plan}
          </span>
        </div>
      </header>

      {/* === SUMMARY GRID === */}
      <section className="summary-grid">

        <div className="summary-card">
          <h3>Subscription Plan</h3>
          <p className={`summary-value sub-${plan.toLowerCase()}`}>{plan}</p>
        </div>

        <div className="summary-card">
          <h3>Total Shops</h3>
          <p className="summary-value">{totalShops}</p>
        </div>

        <div className="summary-card">
          <h3>Status</h3>
          <p className={`summary-value ${user.active ? "active" : "inactive"}`}>
            {user.active ? "Active" : "Inactive"}
          </p>
        </div>
      </section>

      {/* === MY SHOPS SECTION === */}
      <section className="shops-section">
        <div className="shops-header">
          <h2>My Shops</h2>
          <button className="btn small" onClick={() => navigate("/shops")}>
            View All
          </button>
        </div>

        {user.shops?.length ? (
          <div className="shops-grid">
            {user.shops.slice(0, 4).map((shop) => (
              <div
                key={shop.id}
                className="shop-card"
                onClick={() => {
                  selectShop({ id: shop.id, name: shop.name, role: shop.role });
                  navigate(`/shops/${encodeURIComponent(shop.name)}/overview`);
                }}
              >
                <div className="shop-card-head">
                  <h3>{shop.name}</h3>
                  <span className={`role role-${shop.role.toLowerCase()}`}>
                    {shop.role}
                  </span>
                </div>
                <p className="shop-id">Shop ID: {shop.id}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">You don’t have any shops yet.</p>
        )}
      </section>

      {/* === ACTIONS === */}
      <section className="actions">
        <button className="btn primary">Manage Subscription</button>
        <button
          className="btn secondary"
          onClick={() => navigate("/shops/create")}
        >
          Create New Shop
        </button>
      </section>
    </div>
  );
}
