import { useState } from "react";
import "./ShopSettings.css";

export default function ShopSettings() {
  const [form, setForm] = useState({
    // === Identity ===
    name: "",
    description: "",
    logo: null,

    // === Contact & Location ===
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    mapUrl: "",
    timeZone: "Europe/Athens",

    // === Booking Rules ===
    onlineBooking: true,
    manualApproval: false,
    bufferMinutes: 15,
    cancelNotice: 2,
    maxAdvanceDays: 30,

    // === Notifications ===
    emailNotif: true,
    smsNotif: false,
    reminderHours: 2,

    // === Payment ===
    acceptsCash: true,
    acceptsCard: true,
    acceptsOnline: false,
    taxRate: 24,

    // === Appearance ===
    themeColor: "#ffffff",
    accentColor: "#dcdcdc",
    tagline: "",

    // === Danger ===
    deleteConfirm: "",
  });

  const handleChange = (e:any) => {
    const { name, type, value, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Settings saved:", form);
    // TODO: PATCH /shops/:id/settings
  };

  return (
    <div className="settings-container">
      <h1>Shop Settings</h1>
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-sections-wrapper">
          {/* === SECTION 1: Identity === */}
          <section className="settings-section section-full">
            <h2>Shop Identity</h2>
            <div className="settings-grid">
              <label className="half-width">
                Shop Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label className="half-width">
                Logo
                <input type="file" name="logo" onChange={handleChange} />
              </label>

              <label className="full-width">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {/* === SECTION 2: Contact & Location === */}
          <section className="settings-section section-full">
            <h2>Contact & Location</h2>
            <div className="settings-grid">
              <label className="half-width">
                Phone
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="half-width">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label className="full-width">
                Address
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <label className="half-width">
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </label>

              <label className="half-width">
                Postal Code
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </label>

              <label className="full-width">
                Google Maps Link
                <input
                  type="url"
                  name="mapUrl"
                  value={form.mapUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
              </label>

              <label className="half-width">
                Time Zone
                <select
                  name="timeZone"
                  value={form.timeZone}
                  onChange={handleChange}
                >
                  <option value="Europe/Athens">Europe/Athens</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                </select>
              </label>

              <iframe
                className="map-preview"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  form.address + " " + form.city
                )}&output=embed`}
                loading="lazy"
              ></iframe>
            </div>
          </section>

          {/* === SECTION 3: Booking Rules === */}
          <section className="settings-section section-half">
            <h2>Booking & Availability</h2>
            <div className="settings-grid">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="onlineBooking"
                  checked={form.onlineBooking}
                  onChange={handleChange}
                />
                Enable Online Booking
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="manualApproval"
                  checked={form.manualApproval}
                  onChange={handleChange}
                />
                Require Manual Approval
              </label>

              <label>
                Buffer Time (minutes)
                <input
                  type="number"
                  name="bufferMinutes"
                  value={form.bufferMinutes}
                  onChange={handleChange}
                />
              </label>

              <label>
                Cancel Notice (hours)
                <input
                  type="number"
                  name="cancelNotice"
                  value={form.cancelNotice}
                  onChange={handleChange}
                />
              </label>

              <label>
                Max Advance Booking (days)
                <input
                  type="number"
                  name="maxAdvanceDays"
                  value={form.maxAdvanceDays}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {/* === SECTION 4: Notifications === */}
          <section className="settings-section section-half">
            <h2>Notifications</h2>
            <div className="settings-grid">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="emailNotif"
                  checked={form.emailNotif}
                  onChange={handleChange}
                />
                Email Notifications
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="smsNotif"
                  checked={form.smsNotif}
                  onChange={handleChange}
                />
                SMS Notifications
              </label>

              <label>
                Reminder Before (hours)
                <input
                  type="number"
                  name="reminderHours"
                  value={form.reminderHours}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {/* === SECTION 5: Payments === */}
          <section className="settings-section section-half">
            <h2>Payments</h2>
            <div className="settings-grid">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="acceptsCash"
                  checked={form.acceptsCash}
                  onChange={handleChange}
                />
                Accept Cash
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="acceptsCard"
                  checked={form.acceptsCard}
                  onChange={handleChange}
                />
                Accept Card
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="acceptsOnline"
                  checked={form.acceptsOnline}
                  onChange={handleChange}
                />
                Accept Online Payments
              </label>

              <label>
                Tax Rate (%)
                <input
                  type="number"
                  name="taxRate"
                  value={form.taxRate}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {/* === SECTION 6: Appearance === */}
          <section className="settings-section section-half">
            <h2>Appearance</h2>
            <div className="settings-grid">
              <label>
                Theme Color
                <input
                  type="color"
                  name="themeColor"
                  value={form.themeColor}
                  onChange={handleChange}
                />
              </label>
              <label>
                Accent Color
                <input
                  type="color"
                  name="accentColor"
                  value={form.accentColor}
                  onChange={handleChange}
                />
              </label>
              <label className="full-width">
                Tagline
                <input
                  type="text"
                  name="tagline"
                  value={form.tagline}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {/* === SECTION 7: Danger Zone === */}
          <section className="settings-section section-full danger-zone">
            <h2>Danger Zone</h2>
            <p>This action cannot be undone. Type DELETE to confirm.</p>
            <input
              type="text"
              name="deleteConfirm"
              value={form.deleteConfirm}
              onChange={handleChange}
              placeholder="Type DELETE"
            />
            <button
              type="button"
              className="delete-btn"
              disabled={form.deleteConfirm !== "DELETE"}
            >
              Delete Shop
            </button>
          </section>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
