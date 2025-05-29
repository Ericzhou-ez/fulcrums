import Dexie, { Table } from "dexie";
import { v4 as uuidv4 } from "uuid";
import { Product, Supplier, Clients } from "../types/types";

class FulcrumsDatabase extends Dexie {
   products!: Table<Product, string>;
   suppliers!: Table<Supplier, string>;
   clients!: Table<Clients, string>;

   constructor() {
      super("FulcrumsDatabase");

      this.version(3).stores({
         products:
            "productId,productChineseName,productEnglishName,unitPrice,material,hsCode,packing,saved,updatedAt,supplierId,currency",
         suppliers:
            "supplierId,supplierName,supplierPhone,supplierAddress,supplierEmail",
         clients:
            "clientId,companyName,contactEmail,contactName,contactPhoneNumber,eoriNumber,updatedAt",
      });
   }
}

const db = new FulcrumsDatabase();

type TableEntityMap = {
   products: Product;
   suppliers: Supplier;
   clients: Clients;
};
type TableName = keyof TableEntityMap;

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
      return (await db
         .table(tableName)
         .add({ ...recordWithId, updatedAt: new Date().toISOString() })) as string;
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

export async function getSupplierCount(): Promise<number> {
   try {
      const suppliers = await db.suppliers.toArray();
      return suppliers.length;
   } catch (error) {
      console.error("Error retrieving supplier count:", error);
      throw new Error("Failed to retrieve supplier count");
   }
}

export async function getClientCount(): Promise<number> {
   try {
      const clients = await db.clients.toArray();
      return clients.length;
   } catch (error) {
      console.error("Error retrieving client count:", error);
      throw new Error("Failed to retrieve client count");
   }
}

export { db };
