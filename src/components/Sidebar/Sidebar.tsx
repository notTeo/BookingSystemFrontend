import { useMemo, useState } from "react";
import type { Group, UserDTO } from "../../types/user";
import { SUBS } from "../../types/user";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useShop } from "../../context/ShopContext"; 

export default function Sidebar({ user }: { user: UserDTO }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { activeShop, currentRole, selectShop, clearShop } = useShop();

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const subscription = user.subscription ?? "MEMBER";
  const isShopSelected = !!activeShop;

  // ------------------------------
  // GLOBAL GROUPS
  // ------------------------------
  const globalGroups = useMemo<Group[]>(
    () => [
      {
        id: "main",
        label: "",
        subs: SUBS.ALL,
        children: [
          {
            id: "overview",
            label: "Overview",
            link: `/overview`,
            subs: SUBS.ALL,
          },
        ],
      },
      {
        id: "shops",
        label: "My Shops",
        subs: SUBS.ALL,
        children: [
          {
            id: "all-shops",
            label: "All shops",
            link: "/shops",
            subs: SUBS.STARTER,
          },
          ...(Array.isArray(user?.shops)
            ? user.shops.map((s) => ({
                id: `shop-${s.id}`,
                label: s.name,
                link: `/shops/${encodeURIComponent(s.name)}/overview`,
                subs: SUBS.ALL,
                onClick: async () => {
                  await selectShop({ id: s.id, name: s.name, role: s.role });
                  navigate(`/shops/${encodeURIComponent(s.name)}/overview`);
                },
              }))
            : []),
          {
            id: "create-shop",
            label: "+ Create Shop",
            link: "/shops/create",
            subs: SUBS.STARTER,
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        subs: SUBS.ALL,
        children: [
          { id: "account", label: "Account", link: "/settings/account", subs: SUBS.ALL },
          { id: "billing", label: "Billing", link: "/settings/billing", subs: SUBS.STARTER },
        ],
      },
    ],
    [user, selectShop, navigate]
  );

  // ------------------------------
  // SHOP GROUPS
  // ------------------------------
  const shopGroups = useMemo<Group[]>(() => {
    const shopSafeName = activeShop?.name
      ? encodeURIComponent(activeShop.name)
      : null;

    return [
      {
        id: "main",
        label: "",
        subs: SUBS.ALL,
        children: [
          {
            id: "overview",
            label: "Overview",
            link: shopSafeName ? `/shops/${shopSafeName}/overview` : "#",
            subs: SUBS.ALL,
          },
        ],
      },
      {
        id: "operations",
        label: "",
        roles: ["OWNER", "MANAGER", "STAFF"],
        subs: SUBS.ALL,
        children: [
          {
            id: "bookings",
            label: "Bookings",
            link: shopSafeName ? `/shops/${shopSafeName}/bookings` : "#",
            roles: ["OWNER", "MANAGER", "STAFF"],
            subs: SUBS.ALL,
          },
          {
            id: "calendar",
            label: "Calendar",
            link: shopSafeName ? `/shops/${shopSafeName}/calendar` : "#",
            roles: ["OWNER", "MANAGER", "STAFF"],
            subs: SUBS.ALL,
          },
          {
            id: "services",
            label: "Services",
            link: shopSafeName ? `/shops/${shopSafeName}/services` : "#",
            roles: ["OWNER", "MANAGER", "STAFF"],
            subs: SUBS.ALL,
          },
          {
            id: "inventory",
            label: "Inventory",
            link: shopSafeName ? `/shops/${shopSafeName}/inventory` : "#",
            roles: ["OWNER", "MANAGER"],
            subs: SUBS.STARTER,
          },
        ],
      },
      {
        id: "management",
        label: "",
        roles: ["OWNER", "MANAGER"],
        subs: SUBS.STARTER,
        children: [
          {
            id: "team",
            label: "Team",
            link: shopSafeName ? `/shops/${shopSafeName}/team` : "#",
            roles: ["OWNER", "MANAGER"],
            subs: SUBS.STARTER,
          },
          {
            id: "invite",
            label: "Invite Member",
            link: shopSafeName ? `/shops/${shopSafeName}/team/invite` : "#",
            roles: ["OWNER", "MANAGER"],
            subs: SUBS.STARTER,
          },
          {
            id: "settings",
            label: "Settings",
            link: shopSafeName ? `/shops/${shopSafeName}/settings` : "#",
            roles: ["OWNER", "MANAGER"],
            subs: SUBS.ALL,
          },
        ],
      },
    ];
  }, [activeShop?.id]);

  // ------------------------------
  // AVATAR INITIALS
  // ------------------------------
  const initials =
    (user.name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <>
      <button
        className={`hamburger ${sidebarOpen ? "is-active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      <aside id="app-sidebar" className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <div className={`brand ${!activeShop ? "active" : ""}`}>Dashboard</div>

          <div className={`brand shop-mode ${activeShop ? "active" : ""}`}>
            <span className="shop-name">{activeShop?.name}</span>
            <button
              className="back-arrow"
              onClick={() => {
                clearShop();
                navigate("/overview");
              }}
            >
              ←
            </button>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <div
            className={`sidebar-slider ${
              isShopSelected ? "shop-mode" : "global-mode"
            }`}
          >
            {/* === GLOBAL PANEL === */}
            <div className="sidebar-panel global">
              {globalGroups
                .filter((group) => group.subs.includes(subscription))
                .map((group) => (
                  <div key={group.id} className="grp">
                    <button className="grp-btn">
                      <span className="label">{group.label}</span>
                    </button>
                    <div className="panel">
                      {group.children
                        .filter((child) => child.subs.includes(subscription))
                        .map((child) => (
                          <NavLink
                            key={child.id}
                            to={child.link!}
                            onClick={child.onClick}
                            end
                            className={({ isActive }) =>
                              `link ${isActive ? "current" : ""}`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* === SHOP PANEL === */}
            {isShopSelected && (
              <div className="sidebar-panel shop">
                {shopGroups
                  .filter(
                    (group) =>
                      !group.roles || group.roles.includes(currentRole)
                  )
                  .map((group) => (
                    <div key={group.id} className="grp">
                      <button className="grp-btn">
                        <span className="label">{group.label}</span>
                      </button>
                      <div className="panel">
                        {group.children
                          .filter(
                            (child) =>
                              (!child.roles ||
                                child.roles.includes(currentRole)) &&
                              child.subs.includes(subscription)
                          )
                          .map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.link!}
                              end
                              className={({ isActive }) =>
                                `link ${isActive ? "current" : ""}`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="profile">
            <div className="avatar">{initials}</div>
            <div className="info">
              <div className="name">{user.name ?? "User"}</div>
              {isShopSelected ? (
                <div className="role">{currentRole}</div>
              ) : (
                <div className="role">{user?.subscription}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              clearShop();
              logout();
            }}
            className="nav-btn logout-btn"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
