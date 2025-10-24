import { useEffect, useMemo, useState } from "react";
import type { Group, UserDTO, Role } from "../../types/user";
import { SUBS } from "../../types/user";
import "./Sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ user }: { user: UserDTO }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeShop, setActiveShop] = useState<null | {
    id: number;
    name: string;
    role: Role;
  }>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { pathname: currentPath } = useLocation();
  const match = currentPath.match(/\/shops\/([^/]+)/);
  const shopIdFromPath = match ? decodeURIComponent(match[1]) : null;

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const subscription = user.subscription ?? "MEMBER";
  const hasSubscription = !!user.subscription;
  const isShopSelected = !!activeShop;

  // ------------------------------
  // ACTIVE SHOP HANDLING (stable)
  // ------------------------------

  useEffect(() => {
    const storedId = localStorage.getItem("activeShopId");
    if (!user.shops || user.shops.length === 0) return;

    if (!storedId) {
      setActiveShop(null);
      return;
    }

    // Match by ID instead of name
    const found = user.shops.find((s) => String(s.id) === storedId);
    if (found) {
      setActiveShop({ id: found.id, name: found.name, role: found.role });
    } else {
      setActiveShop(null);
      localStorage.removeItem("activeShopId");
    }
  }, [activeShop?.id, activeShop?.name]);

  const currentRole: Role = activeShop?.role ?? "NONE";

  // ------------------------------
  // GLOBAL GROUPS
  // ------------------------------
  const globalGroups = useMemo<Group[]>(
    () => [
      // ---------------------------
      // TOP: MAIN ACCESS
      // ---------------------------
      {
        id: "main",
        label: "", // no visible header
        subs: SUBS.ALL,
        children: [
          {
            id: "overview",
            label: "Overview",
            link: "/overview",
            subs: SUBS.ALL,
          },
          {
            id: "inbox",
            label: "Inbox",
            link: "/inbox",
            subs: SUBS.ALL,
          },
        ],
      },

      // ---------------------------
      // MY SHOPS
      // ---------------------------
      {
        id: "shops",
        label: "My Shops",
        subs: SUBS.ALL,
        children: [
          ...(Array.isArray(user?.shops) && user.shops.length >= 2
            ? [
                {
                  id: "all-shops",
                  label: "All Shops",
                  link: "/shops/all",
                  subs: SUBS.STARTER,
                },
              ]
            : []),

          ...(Array.isArray(user?.shops)
            ? user.shops.map((s) => ({
                id: `shop-${s.id}`,
                label: s.name,
                link: `/shops/${encodeURIComponent(s.name)}/overview`,
                subs: SUBS.ALL,
                onClick: () => {
                  setActiveShop({ id: s.id, name: s.name, role: s.role });
                  localStorage.setItem("activeShopId", String(s.id)); // store ID for reloads
                  localStorage.setItem("activeShopName", s.name); // optional cosmetic storage
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

      // ---------------------------
      // CENTRAL INVENTORY (PRO)
      // ---------------------------
      {
        id: "central",
        label: "",
        subs: SUBS.ALL,
        children: [
          {
            id: "central-inventory",
            label: "Central Inventory",
            link: "/central-inventory",
            subs: SUBS.ALL,
          },
          {
            id: "create-central-item",
            label: "Add Item",
            link: "/central-inventory/create",
            subs: SUBS.ALL,
          },
        ],
      },

      // ---------------------------
      // ACCOUNT SETTINGS (BOTTOM)
      // ---------------------------
      {
        id: "settings",
        label: "Settings",
        subs: SUBS.ALL,
        children: [
          {
            id: "account",
            label: "Account",
            link: "/settings/account",
            subs: SUBS.ALL,
          },
          {
            id: "billing",
            label: "Billing",
            link: "/settings/billing",
            subs: SUBS.STARTER,
          },
        ],
      },
    ],
    [user]
  );

  // ------------------------------
  // SHOP GROUPS
  // ------------------------------
  const shopGroups = useMemo<Group[]>(() => {
    const shopSafeName = activeShop?.name
      ? encodeURIComponent(activeShop.name)
      : shopIdFromPath
        ? encodeURIComponent(shopIdFromPath)
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
  }, [activeShop?.id, shopIdFromPath]);

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

      <aside
        id="app-sidebar"
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-head">
          <div className={`brand ${!activeShop ? "active" : ""}`}>
            Dashboard
          </div>

          <div className={`brand shop-mode ${activeShop ? "active" : ""}`}>
            <span className="shop-name">{activeShop?.name}</span>
            <button
              className="back-arrow"
              onClick={() => {
                setActiveShop(null);
                localStorage.removeItem("activeShopId");
                localStorage.removeItem("activeShopName");
                navigate("/overview");
              }}
            >
              ←
            </button>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <div
            className={`sidebar-slider ${isShopSelected ? "shop-mode" : "global-mode"}`}
          >
            {/* === GLOBAL PANEL === */}
            <div className="sidebar-panel global">
              {hasSubscription &&
                globalGroups
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
                    (group) => !group.roles || group.roles.includes(currentRole)
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
              {/* Fixed: show role when shop selected, subscription otherwise */}
              {isShopSelected ? (
                <div className="role">{currentRole}</div>
              ) : (
                <div className="role">{user?.subscription}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setActiveShop(null);
              localStorage.removeItem("activeShopId");
              localStorage.removeItem("activeShopName");
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
