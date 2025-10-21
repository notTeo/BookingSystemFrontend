import { useEffect, useState } from "react";
import "./Inbox.css";
import { acceptInvite, declineInvite, getInbox } from "../../api/user";

export default function Inbox() {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "received" | "sent">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getInbox();
      setReceived(data.received || []);
      setSent(data.sent || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleAction = async (id: number, action: "accept" | "decline") => {
    if (action === "accept") await acceptInvite(id);
    else await declineInvite(id);
    setReceived((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: action === "accept" ? "ACCEPTED" : "DECLINED" }
          : i
      )
    );
  };

  if (loading) {
    return (
      <div className="inbox-page">
        <h2 className="inbox-title">Inbox</h2>
        <p className="inbox-loading">Loading...</p>
      </div>
    );
  }

  // Build the unified list
  const allInvites = [
    ...received.map((i) => ({ ...i, type: "received" })),
    ...sent.map((i) => ({ ...i, type: "sent" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const currentList =
    activeTab === "received"
      ? received
      : activeTab === "sent"
      ? sent
      : allInvites;

  return (
    <div className="inbox-page">
      <h2 className="inbox-title">Inbox</h2>

      {/* Tabs */}
      <div className="inbox-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <button
          className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
      </div>

      {/* Empty state */}
      {currentList.length === 0 ? (
        <p className="inbox-empty">
          {activeTab === "received"
            ? "No invites received"
            : activeTab === "sent"
            ? "No invites sent"
            : "No invites yet"}
        </p>
      ) : (
        <div className="inbox-list">
          {currentList.map((invite) => {
            const isPending = invite.status === "PENDING";
            const isReceived = invite.type === "received";

            return (
              <div
                key={invite.id}
                className={`invite-card status-${invite.status.toLowerCase()}`}
              >
                <div className="invite-info">
                  <p className="invite-shop">
                    <span className="label">Shop:</span> {invite.shop.name}
                  </p>
                  <p className="invite-role">
                    <span className="label">Role:</span> {invite.role}
                  </p>
                  {invite.message && (
                    <p className="invite-message">
                      <span className="label">Message:</span> {invite.message}
                    </p>
                  )}
                  <p className="invite-status">
                    <span className="label">Status:</span> {invite.status}
                  </p>
                  {isReceived ? (
                    <p className="invite-from">
                      <span className="label">From:</span>{" "}
                      {invite.sender?.name || invite.sender?.email}
                    </p>
                  ) : (
                    <p className="invite-to">
                      <span className="label">To:</span> {invite.email}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {isReceived && isPending ? (
                  <div className="invite-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAction(invite.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => handleAction(invite.id, "decline")}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="invite-result">
                    {invite.status === "ACCEPTED" && (
                      <span className="accepted-text">Accepted ✔</span>
                    )}
                    {invite.status === "DECLINED" && (
                      <span className="declined-text">Declined ✖</span>
                    )}
                    {invite.status === "EXPIRED" && (
                      <span className="expired-text">Expired ⏰</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
