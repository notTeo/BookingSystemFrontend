import { useEffect, useState } from "react";
import "./Inventory.css";
import {
  getInventoryItems,
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../../api/inventory";
import { useShop } from "../../context/ShopContext";
import type { InventoryItem } from "../../types/inventory";

interface NewItem {
  name: string;
  category: string;
  quantity: number | "";
  unit: string;
  photo?: string;
}

export default function Inventory() {
  const { activeShop } = useShop();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<NewItem>({
    name: "",
    category: "",
    quantity: "",
    unit: "",
  });

  // === Fetch items ===
  useEffect(() => {
    if (!activeShop) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getInventoryItems(activeShop.id);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeShop]);

  // === Handle image preview ===
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // === Input changes ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // === Open modal for editing ===
  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category || "",
      quantity: item.quantity,
      unit: item.unit || "",
    });
    setPreview(item.photoUrl || null);
    setShowModal(true);
  };

  // === Handle submit (create or update) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShop) return;

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      if (editingItem) {
        // === UPDATE existing item ===
        const updated = await updateInventoryItem(
          activeShop.id,
          editingItem.id,
          {
            name: form.name.trim(),
            category: form.category || undefined,
            quantity: Number(form.quantity) || 0,
            unit: form.unit || undefined,
            photoUrl: preview || undefined,
          }
        );

        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? updated : i))
        );
      } else {
        // === CREATE new item ===
        const newItem = await createInventoryItem(activeShop.id, {
          name: form.name.trim(),
          category: form.category || undefined,
          quantity: Number(form.quantity) || 0,
          unit: form.unit || undefined,
          photoUrl: preview || undefined,
        });
        setItems((prev) => [newItem, ...prev]);
      }

      setShowModal(false);
      setEditingItem(null);
      setForm({ name: "", category: "", quantity: "", unit: "" });
      setPreview(null);
    } catch (err) {
      console.error("Failed to save item:", err);
      alert("Error saving item.");
    }
  };

  // === Delete ===
  const handleDelete = async (id: number) => {
    if (!activeShop) return;
    const confirmDelete = confirm("Delete this item?");
    if (!confirmDelete) return;
    try {
      await deleteInventoryItem(activeShop.id, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting item.");
    }
  };

  const total = items.length;
  const lowStock = items.filter((i) => i.lowStock).length;
  const inStock = total - lowStock;

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <h1>Inventory</h1>
        <button
          className="btn primary"
          onClick={() => setShowModal(true)}
          disabled={!activeShop}
        >
          + Add Item
        </button>
      </header>

      <section className="inventory-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>In Stock</h3>
          <p className="active">{inStock}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock</h3>
          <p className="inactive">{lowStock}</p>
        </div>
      </section>

      <section className="inventory-table">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id ?? `temp-${index}`}>
                  <td>
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="item-photo"
                      />
                    ) : (
                      <div className="photo-placeholder">—</div>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category || "—"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${item.lowStock ? "inactive" : "active"}`}
                    >
                      {item.lowStock ? "Low Stock" : "OK"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn small"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">No items found.</div>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Item Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Category</label>
                <input
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row-grid">
                <div className="form-row">
                  <label>Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <label>Unit</label>
                  <input
                    name="unit"
                    type="text"
                    value={form.unit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <label>Photo</label>
                <div className="image-upload">
                  <input type="file" accept="image/*" onChange={handleImage} />
                  {preview ? (
                    <img src={preview} alt="preview" className="preview-img" />
                  ) : (
                    <div className="preview-placeholder">No image selected</div>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingItem ? "Save Changes" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
