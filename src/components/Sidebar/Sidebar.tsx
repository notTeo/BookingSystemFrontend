import { useEffect, useMemo, useState } from "react";
import type { Group, UserDTO } from "../../types/user";
import "./Sidebar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ user }: { user: UserDTO }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeShop, setActiveShop] = useState<null | {
    id: number;
    name: string;
  }>(null);
  const isShopSelected = !!activeShop;

  // ✅ must come BEFORE match
  const { pathname: currentPath } = useLocation();

  // ✅ extract shop id from URL
  const match = currentPath.match(/\/shops\/(\d+)/);
  const shopIdFromPath = match ? Number(match[1]) : null;

  const toggleGroup = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // ---------------------
  // GLOBAL GROUPS
  // ---------------------
  const globalGroups = useMemo<Group[]>(
    () => [
      {
        id: "shops",
        label: "My Shops",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "all-shops",
            label: "All Shops",
            link: "/shops/all",
            roles: ["BUSINESS"] as const,
          },
          ...(Array.isArray(user?.shops)
            ? user.shops.map((s) => ({
                id: `shop-${s.id}`,
                label: s.name,
                link: `/shops/${s.id}/overview`,
                roles: ["BUSINESS", "MANAGER", "STAFF"] as const,
              }))
            : []),
          {
            id: "create-shop",
            label: "+ Create Shop",
            link: "/shops/create",
            roles: ["BUSINESS"] as const,
          },
        ],
      },
      {
        id: "central-inventory",
        label: "Central Inventory",
        roles: ["BUSINESS"],
        children: [
          {
            id: "inventory",
            label: "All Items",
            link: "/central-inventory",
            roles: ["BUSINESS"],
          },
          {
            id: "create-item",
            label: "Add Item",
            link: "/central-inventory/create",
            roles: ["BUSINESS"],
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "account",
            label: "Account",
            link: "/settings/account",
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "billing",
            label: "Billing",
            link: "/settings/billing",
            roles: ["BUSINESS"],
          },
        ],
      },
    ],
    [user]
  );

  // ---------------------
  // SHOP GROUPS
  // ---------------------
  const shopGroups = useMemo<Group[]>(
    () => [
      {
        id: "team",
        label: "Team",
        roles: ["BUSINESS", "MANAGER"],
        children: [
          {
            id: "shop-team",
            label: "All Members",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/team`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "invite",
            label: "Invite Member",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/team/invite`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
      {
        id: "services",
        label: "Services",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "service-library",
            label: "Service Library",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/services`,
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "assign-services",
            label: "Assign Services",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/services/assign`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
      {
        id: "bookings",
        label: "Bookings",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "calendar",
            label: "Calendar",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/calendar`,
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "all-bookings",
            label: "All Bookings",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/bookings`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "add-booking",
            label: "Add Booking",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/bookings/create`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
      {
        id: "inventory",
        label: "Shop Inventory",
        roles: ["BUSINESS", "MANAGER"],
        children: [
          {
            id: "shop-items",
            label: "All Items",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/inventory`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "add-item",
            label: "Add Item",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/inventory/create`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
      {
        id: "shop-settings",
        label: "Shop Settings",
        roles: ["BUSINESS", "MANAGER"],
        children: [
          {
            id: "settings",
            label: "General",
            link: `/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/settings`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
    ],
    [activeShop?.id, shopIdFromPath]
  );

  // ---------------------
  // Pick which group set to render
  // ---------------------
  const groups = isShopSelected ? shopGroups : globalGroups;

  const visibleGroups = groups
    .filter((g) => g.roles.includes(user.role))
    .map((g) => ({
      ...g,
      children: g.children.filter((c) => c.roles.includes(user.role)),
    }))
    .filter((g) => g.children.length);

  // ---------------------
  // Auto-open group for current path
  // ---------------------
  useEffect(() => {
    const matchingGroup = visibleGroups.find((group) =>
      group.children.some((c) => currentPath === c.link)
    );
    if (matchingGroup) {
      setOpen((prev) => {
        if (prev.hasOwnProperty(matchingGroup.id)) return prev;
        return { ...prev, [matchingGroup.id]: true };
      });
    }
  }, [currentPath, visibleGroups]);

  // ---------------------
  // Sync activeShop with URL or localStorage
  // ---------------------
  useEffect(() => {
    const id = shopIdFromPath ?? Number(localStorage.getItem("activeShop"));
    const found = user.shops?.find((s) => s.id === id) ?? null;
    setActiveShop(found);
    if (found) localStorage.setItem("activeShop", String(found.id));
    else localStorage.removeItem("activeShop");
  }, [shopIdFromPath, user.shops]);

  // ---------------------
  // User initials
  // ---------------------
  const initials =
    (user.name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  // ---------------------
  // RENDER
  // ---------------------
  return (
    <>
      <button
        className={`hamburger ${sidebarOpen ? "is-active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
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
          {isShopSelected && activeShop ? (
            <div className="brand shop-mode">
              <button
                className="back-arrow"
                onClick={() => {
                  setActiveShop(null);
                  localStorage.removeItem("activeShop");
                  navigate("/overview");
                }}
              >
                ←
              </button>
              <span className="shop-name">{activeShop.name}</span>
            </div>
          ) : (
            <div className="brand">Dashboard</div>
          )}
        </div>

        <nav className="nav" aria-label="Primary">
          <div
            className={`sidebar-slider ${isShopSelected ? "shop-mode" : "global-mode"}`}
          >
            <div className="sidebar-panel global">
              <NavLink
                key={"overview"}
                to={`/overview`}
                end
                className={({ isActive }) =>
                  `link ${isActive ? "current" : ""}`
                }
              >
                Overview
              </NavLink>

              {globalGroups.map((group) => (
                <div key={group.id} className="grp">
                  <button className="grp-btn">
                    <span className="label">{group.label}</span>
                  </button>
                  <div className="panel">
                    {group.children.map((child) => (
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

            <div className="sidebar-panel shop">
            <NavLink
                key={"shop-overview"}
                to={`/shops/${shopIdFromPath ?? activeShop?.id ?? "active"}/overview`}
                end
                className={({ isActive }) =>
                  `link ${isActive ? "current" : ""}`
                }
              >
                Overview
              </NavLink>
              {shopGroups.map((group) => (
                <div key={group.id} className="grp">
                  <button className="grp-btn">
                    <span className="label">{group.label}</span>
                  </button>
                  <div className="panel">
                    {group.children.map((child) => (
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
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="profile">
            <div className="avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="info">
              <div className="name" title={user.name}>
                {user.name ?? "User"}
              </div>
              <div className="role">{user.role}</div>
            </div>
          </div>
          <button onClick={logout} className="nav-btn logout-btn">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
