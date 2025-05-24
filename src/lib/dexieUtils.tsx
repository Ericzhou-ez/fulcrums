import Dexie, { Table } from "dexie";
import { v4 as uuidv4 } from "uuid";
import { Product, Supplier, Clients } from "../types/types";

// Initialize Dexie database
class FulcrumsDatabase extends Dexie {
   products!: Table<Product, string>;
   suppliers!: Table<Supplier, string>;
   clients!: Table<Clients, string>;

   constructor() {
      super("FulcrumsDatabase");
      this.version(1).stores({
         products:
            "productId,productChineseName,productEnglishName,unitPrice,material,hsCode,packing,saved,updatedAt,supplierId,currency",
         suppliers:
            "supplierId,supplierName,supplierPhoneNumber,supplierAddress,supplierEmail",
         clients:
            "clientId,companyName,contactEmail,contactName,contactPhoneNumber,eoriNumber,updatedAt",
      });
   }
}

const db = new FulcrumsDatabase();

// Map table names to their corresponding entity types
type TableEntityMap = {
   products: Product;
   suppliers: Supplier;
   clients: Clients;
};

// Generic type for table names
type TableName = keyof TableEntityMap;

// Utility to ensure ID is provided or generated
function ensureId<T extends TableEntityMap[TableName]>(
   tableName: TableName,
   record: Partial<T>
): T {
   const idField =
      tableName === "products"
         ? "productId"
         : tableName === "suppliers"
         ? "supplierId"
         : "clientId";
   return {
      ...record,
      [idField]: (record as any)[idField] || uuidv4(),
   } as T;
}

// Generic CRUD functions
export async function addRecord<T extends TableEntityMap[TableName]>(
   tableName: TableName,
   record: Partial<T>
): Promise<string> {
   try {
      const recordWithId = ensureId(tableName, record);
      return await db.table(tableName).add(recordWithId);
      
   } catch (error) {
      console.error(`Error adding record to ${tableName}:`, error);
      throw new Error(`Failed to add record to ${tableName}`);
   }
}

export async function addRecords<T extends TableEntityMap[TableName]>(
   tableName: TableName,
   records: Partial<T>[]
): Promise<void> {
   try {
      const recordsWithIds = records.map((record) =>
         ensureId(tableName, record)
      );
      await db.table(tableName).bulkAdd(recordsWithIds);
   } catch (error) {
      console.error(`Error adding records to ${tableName}:`, error);
      throw new Error(`Failed to add records to ${tableName}`);
   }
}

export async function getAllRecords<T extends TableEntityMap[TableName]>(
   tableName: TableName
): Promise<T[]> {
   try {
      return await db.table(tableName).toArray();
   } catch (error) {
      console.error(`Error retrieving records from ${tableName}:`, error);
      throw new Error(`Failed to retrieve records from ${tableName}`);
   }
}

export async function getRecordById<T extends TableEntityMap[TableName]>(
   tableName: TableName,
   id: string
): Promise<T | undefined> {
   try {
      return await db.table(tableName).get(id);
   } catch (error) {
      console.error(`Error retrieving record ${id} from ${tableName}:`, error);
      throw new Error(`Failed to retrieve record from ${tableName}`);
   }
}

export async function updateRecord<T extends TableEntityMap[TableName]>(
   tableName: TableName,
   id: string,
   updates: Partial<T>
): Promise<void> {
   try {
      await db.table(tableName).update(id, updates);
   } catch (error) {
      console.error(`Error updating record ${id} in ${tableName}:`, error);
      throw new Error(`Failed to update record in ${tableName}`);
   }
}

export async function deleteRecord(
   tableName: TableName,
   id: string
): Promise<void> {
   try {
      await db.table(tableName).delete(id);
   } catch (error) {
      console.error(`Error deleting record ${id} from ${tableName}:`, error);
      throw new Error(`Failed to delete record from ${tableName}`);
   }
}

export async function clearTable(tableName: TableName): Promise<void> {
   try {
      await db.table(tableName).clear();
   } catch (error) {
      console.error(`Error clearing ${tableName}:`, error);
      throw new Error(`Failed to clear ${tableName}`);
   }
}

// Get product count for OfflineDrawer
export async function getProductCount(): Promise<number> {
   try {
      const products = await db.products.toArray();
      return products.length;
   } catch (error) {
      console.error("Error retrieving product count:", error);
      throw new Error("Failed to retrieve product count");
   }
}

// Export database instance for advanced queries
export { db };
