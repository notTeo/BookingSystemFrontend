import { useEffect, useMemo, useState } from "react";
import type { Role } from "../../types/user";
import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Item = { id: string; label: string; link: string; roles: Role[] };
type Group = { id: string; label: string; roles: Role[]; children: Item[] };

export default function Sidebar({ role, name }: { role: Role; name?: string }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  

  const { logout } = useAuth();

  const [activeShop, setActiveShop] = useState<null | {
    id: number;
    name: string;
  }>(null);
  const isShopSelected = !!activeShop;

  const { pathname: currentPath } = useLocation();


  const toggleGroup = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // ---------------------
  // GLOBAL GROUPS (no shop selected)
  // ---------------------
  const globalGroups = useMemo<Group[]>(
    () => [
      {
        id: "shops",
        label: "Shops",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "my-shops",
            label: "My Shops",
            link: "/shops",
            roles: ["BUSINESS"],
          },
          {
            id: "assigned-shops",
            label: "Assigned Shops",
            link: "/shops/assigned",
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "create-shop",
            label: "Create Shop",
            link: "/shops/create",
            roles: ["BUSINESS"],
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
    []
  );

  // ---------------------
  // SHOP GROUPS (active shop context)
  // ---------------------
  const shopGroups = useMemo<Group[]>(
    () => [
      {
        id: "overview",
        label: "Overview",
        roles: ["BUSINESS", "MANAGER", "STAFF"],
        children: [
          {
            id: "overview",
            label: "Shop Overview",
            link: `/shops/${activeShop?.id ?? "active"}/overview`,
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
        ],
      },
      {
        id: "team",
        label: "Team",
        roles: ["BUSINESS", "MANAGER"],
        children: [
          {
            id: "shop-team",
            label: "All Members",
            link: `/shops/${activeShop?.id ?? "active"}/team`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "invite",
            label: "Invite Member",
            link: `/shops/${activeShop?.id ?? "active"}/team/invite`,
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
            link: `/shops/${activeShop?.id ?? "active"}/services`,
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "assign-services",
            label: "Assign Services",
            link: `/shops/${activeShop?.id ?? "active"}/services/assign`,
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
            link: `/shops/${activeShop?.id ?? "active"}/calendar`,
            roles: ["BUSINESS", "MANAGER", "STAFF"],
          },
          {
            id: "all-bookings",
            label: "All Bookings",
            link: `/shops/${activeShop?.id ?? "active"}/bookings`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "add-booking",
            label: "Add Booking",
            link: `/shops/${activeShop?.id ?? "active"}/bookings/create`,
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
            link: `/shops/${activeShop?.id ?? "active"}/inventory`,
            roles: ["BUSINESS", "MANAGER"],
          },
          {
            id: "add-item",
            label: "Add Item",
            link: `/shops/${activeShop?.id ?? "active"}/inventory/create`,
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
            link: `/shops/${activeShop?.id ?? "active"}/settings`,
            roles: ["BUSINESS", "MANAGER"],
          },
        ],
      },
    ],
    [activeShop?.id]
  );

  // ---------------------
  // Pick which group set to render
  // ---------------------
  const groups = isShopSelected ? shopGroups : globalGroups;

  const visibleGroups = groups
    .filter((g) => g.roles.includes(role))
    .map((g) => ({
      ...g,
      children: g.children.filter((c) => c.roles.includes(role)),
    }))
    .filter((g) => g.children.length);

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


  const initials =
    (name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

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
          <div className="brand">
            {isShopSelected ? activeShop?.name ?? "Shop" : "Dashboard"}
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <NavLink
            key={"overview"}
            to={"/overview"}
            end
            className={({ isActive }) => `link ${isActive ? "current" : ""}`}
          >
            Overview
          </NavLink>
          {visibleGroups.map((group) => {
            const expanded = !!open[group.id];
            const groupActive = group.children.some(
              (c) => currentPath === c.link
            );

            return (
              <div key={group.id} className="grp">
                <button
                  className={`grp-btn`}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={expanded}
                  aria-controls={`sect-${group.id}`}
                  type="button"
                >
                  <span className="label">{group.label}</span>
                </button>

                <div id={`sect-${group.id}`} className={`panel`}>
                  {group.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.link}
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
            );
          })}
        </nav>
          <div className="sidebar-footer">
            <div className="profile">
              <div className="avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="info">
                <div className="name" title={name}>
                  {name ?? "User"}
                </div>
                <div className="role">{role}</div>
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
