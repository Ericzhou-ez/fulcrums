import { Supplier } from "../types/types";

export function getSupplierIdByName(
   name: string,
   suppliers: Record<string, any>
): string | null {
   for (const [id, details] of Object.entries(suppliers)) {
      if (details.supplierName === name) return id;
   }
   return null;
}

export function getSupplierFromId(
   id: string,
   suppliers: Record<string, any>
): Supplier | null {
   for (const [id, details] of Object.entries(suppliers)) {
      if (id === id) return details;
   }
   return null;
}

