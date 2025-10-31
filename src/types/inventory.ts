export interface InventoryItem {
    id: number;
    shopId: number;
    name: string;
    category?: string | null;
    quantity: number;
    unit?: string | null;
    photoUrl?: string | null;
    lowStock: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }
  