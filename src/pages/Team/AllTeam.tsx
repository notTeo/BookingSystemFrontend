import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { getShopTeam, toggleShopUserBookable, toggleShopUserStatus } from "../../api/shop";
import type { GetShopTeamResponse } from "../../types/shop";
import "./AllTeam.css";

type Member = GetShopTeamResponse["members"][number];

export default function ShopTeam() {
  const { activeShop, currentRole } = useShop();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const canManage = useMemo(
    () => currentRole === "OWNER" || currentRole === "MANAGER",
    [currentRole]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!activeShop?.id) return;
      try {
        const res = await getShopTeam(activeShop.id);
        if (!mounted) return;
        setMembers(res.data.members);
      } catch (e) {
        if (!mounted) return;
        setError((e as Error).message || "Failed to load team");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeShop?.id]);

  const handleToggleStatus = async (m: Member) => {
    if (!activeShop?.id) return;
    try {
      const res = await toggleShopUserStatus(activeShop.id, m.id);
  
      const newActive = res.data.updated.active;
  
      setMembers((prev) =>
        prev.map((mem) =>
          mem.id === m.id ? { ...mem, active: newActive } : mem
        )
      );
    } catch (err) {
      console.error("Failed to toggle member:", err);
    }
  };

  const handleToggleBookable = async (m: Member) => {
    if (!activeShop?.id) return;
    try {
      const res = await toggleShopUserBookable(activeShop.id, m.id);
  
      const newActive = res.data.updated.active;
  
      setMembers((prev) =>
        prev.map((mem) =>
          mem.id === m.id ? { ...mem, active: newActive } : mem
        )
      );
    } catch (err) {
      console.error("Failed to toggle member:", err);
    }
  };

  const goToMember = (m: Member) => {
    const shopName = encodeURIComponent(activeShop!.name);
    navigate(`/shops/${shopName}/team/${m.name}`);
  };

  if (loading)
    return (
      <div className="team-page">
        <p>Loading team…</p>
      </div>
    );
  if (error)
    return (
      <div className="team-page error">
        <p>{error}</p>
      </div>
    );

  const total = members.length;
  const activeCount = members.filter((m) => m.active).length;
  const inactiveCount = total - activeCount;

  return (
    <div className="team-page">
      <header className="team-header">
        <h1>{activeShop?.name} — Team</h1>
        {canManage && (
          <button
            className="btn primary"
            onClick={() =>
              navigate(
                `/shops/${encodeURIComponent(activeShop!.name)}/team/invite`
              )
            }
          >
            + Add Member
          </button>
        )}
      </header>

      <section className="team-stats">
        <div className="stat-card">
          <h3>Total Members</h3>
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

      <section className="team-table">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Bookable</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.length ? (
              members.map((m) => (
                <tr key={m.id} className="row">
                  <td className="cell-member" onClick={() => goToMember(m)}>
                    <div className="avatar">{initials(m.name)}</div>
                    <div className="who">
                      <div className="name">{m.name}</div>
                      <div className="id">#{m.id}</div>
                    </div>
                  </td>

                  <td onClick={() => goToMember(m)}>
                    <span className="email">{m.email}</span>
                  </td>

                  <td onClick={() => goToMember(m)}>
                    <span className={`role role-${m.role.toLowerCase()}`}>
                      {m.role}
                    </span>
                  </td>

                  <td>
                    <label
                      className={`switch ${!canManage || (currentRole === "MANAGER" && m.role === "OWNER") ? "disabled" : ""}`}
                    >
                   <input
                      type="checkbox"
                      checked={m.active}
                      onChange={() => handleToggleStatus(m)}
                      className="status-checkbox"
                    />
                      <span className="slider" />
                    </label>
                  </td>
                  <td>
                    <label
                      className={`switch ${!canManage || (currentRole === "MANAGER" && m.role === "OWNER") ? "disabled" : ""}`}
                    >
                   <input
                      type="checkbox"
                      checked={m.bookable}
                      onChange={() => handleToggleBookable(m)}
                      className="status-checkbox"
                    />
                      <span className="slider" />
                    </label>
                  </td>

                  <td onClick={() => goToMember(m)}>
                    {new Date(m.joinedAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty">
                  No team members found.
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
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
}
