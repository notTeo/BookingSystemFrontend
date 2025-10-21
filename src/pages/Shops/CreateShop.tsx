import { useMemo, useState } from "react";
import { createShop } from "../../api/shop";
import type { Day, HourRow } from "../../types/shop";
import "./CreateShop.css";

const DAYS: Day[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function CreateShopWizard() {
  const [step, setStep] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [hours, setHours] = useState<HourRow[]>(
    DAYS.map((d) => ({
      dayOfWeek: d,
      openTime: "09:00",
      closeTime: "17:00",
      isClosed: false,
    }))
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const canGoNext = useMemo(() => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) {
      return hours.every((h) => {
        if (h.isClosed) return true;
        if (!h.openTime || !h.closeTime) return false;
        return h.openTime < h.closeTime;
      });
    }
    return true;
  }, [step, name, hours]);

  const goNext = () => {
    if (!canGoNext) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const setHourAt = (idx: number, patch: Partial<HourRow>) => {
    setHours((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await createShop(
        name,
        hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.isClosed ? null : h.openTime,
          closeTime: h.isClosed ? null : h.closeTime,
          isClosed: h.isClosed,
        }))
      );
        
      window.location.href = "/shops";
      window.location.reload
    } catch (e: any) {
      setError(e?.message );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wizard">
      <div className="wizard-head">
        <h1>Create a New Shop</h1>
        <div className="wizard-steps">
          <StepDot label="Details" active={step === 0} done={step > 0} />
          <StepDot label="Hours" active={step === 1} done={step > 1} />
          <StepDot label="Review" active={step === 2} done={false} />
        </div>
      </div>

      <div className="wizard-body">
        {step === 0 && (
          <section className="card">
            <h2 className="card-title">Shop Details</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="shop-name">
                  Name <span className="req">*</span>
                </label>
                <input
                  id="shop-name"
                  type="text"
                  placeholder="e.g. Downtown Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {!name.trim() && <p className="hint">Name is required.</p>}
              </div>

              <div className="form-field">
                <label htmlFor="shop-address">Address</label>
                <input
                  id="shop-address"
                  type="text"
                  placeholder="Optional (e.g. 123 Main St)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="card">
            <h2 className="card-title">Opening Hours</h2>

            <div className="hours-table">
              <div className="hours-row hours-head">
                <div>Day</div>
                <div>Open</div>
                <div>Close</div>
                <div className="center">Closed</div>
              </div>

              {hours.map((row, idx) => (
                <div className="hours-row" key={row.dayOfWeek}>
                  <div className="day">{row.dayOfWeek}</div>

                  <div>
                    <input
                      type="time"
                      value={row.openTime}
                      disabled={row.isClosed}
                      onChange={(e) =>
                        setHourAt(idx, { openTime: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <input
                      type="time"
                      value={row.closeTime}
                      disabled={row.isClosed}
                      onChange={(e) =>
                        setHourAt(idx, { closeTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="center">
                    <input
                      type="checkbox"
                      checked={row.isClosed}
                      onChange={() =>
                        setHourAt(idx, { isClosed: !row.isClosed })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {!canGoNext && (
              <p className="hint">
                For open days, set valid times (Open must be earlier than
                Close).
              </p>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="card">
            <h2 className="card-title">Review & Create</h2>

            <div className="review-grid">
              <div>
                <div className="review-label">Name</div>
                <div className="review-value">{name || "-"}</div>
              </div>

              <div>
                <div className="review-label">Address</div>
                <div className="review-value">{address || "-"}</div>
              </div>

              <div className="review-hours">
                <div className="review-label">Opening Hours</div>
                <ul>
                  {hours.map((h) => (
                    <li key={h.dayOfWeek}>
                      <span className="review-day">{h.dayOfWeek}:</span>{" "}
                      {h.isClosed ? "Closed" : `${h.openTime} - ${h.closeTime}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {error && <p className="error">{error}</p>}
          </section>
        )}
      </div>

      <div className="wizard-actions">
        <button
          className="arrow-btn"
          onClick={goPrev}
          disabled={step === 0 || submitting}
          aria-label="Previous step"
          title="Previous"
        >
          ←
        </button>

        {step < 2 ? (
          <button
            className="primary-btn"
            onClick={goNext}
            disabled={!canGoNext || submitting}
          >
            Next →
          </button>
        ) : (
          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Shop"}
          </button>
        )}
      </div>
    </div>
  );
}

function StepDot({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className={`step-dot ${active ? "active" : ""} ${done ? "done" : ""}`}>
      <span className="dot" />
      <span className="lbl">{label}</span>
    </div>
  );
}
