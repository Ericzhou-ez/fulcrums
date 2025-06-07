import React, {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
   useMemo,
} from "react";
import { Product, Supplier, Clients, SyncPayload } from "../types/types";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebase";
import { db as DexieDataBase } from "../lib/dexieUtils";
import { useAuth } from "./authContexts";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";

export type ProductSupplierClientContextType = {
   addProduct: (product: any) => Promise<void>;
   editProduct: (product: any) => Promise<void>;
   deleteProducts: (productId: string[]) => Promise<void>;
   addSupplier: (supplier: any) => Promise<void>;
   editSupplier: (supplier: any) => Promise<void>;
   deleteSupplier: (supplierId: string) => Promise<void>;
   addClient: (client: any) => Promise<void>;
   editClient: (client: any) => Promise<void>;
   deleteClient: (clientId: string) => Promise<void>;
   getClients: () => Promise<Object>;
   getSuppliers: () => Promise<Object>;
   toggleSaveUnsaveProduct: (productId: string) => Promise<void>;
   setAddedProduct: React.Dispatch<React.SetStateAction<boolean>>;
   setAddedClient: React.Dispatch<React.SetStateAction<boolean>>;
   setAddedSupplier: React.Dispatch<React.SetStateAction<boolean>>;
   setDeletedClient: React.Dispatch<React.SetStateAction<boolean>>;
   addedProduct: boolean;
   editedProduct: boolean;
   deletedProduct: boolean;
   addedSupplier: boolean;
   editedSupplier: boolean;
   deletedSupplier: boolean;
   addedClient: boolean;
   editedClient: boolean;
   deletedClient: boolean;
   serviceLoading: boolean;
   products: Record<string, Product>;
   suppliers: { [key: string]: any };
   clients: { [key: string]: any };
   errorMessages: string;
   setErrorMessages: React.Dispatch<React.SetStateAction<string>>;
   syncAll: (payload: SyncPayload) => Promise<void>;
   syncState: "idle" | "syncing" | "done";
};

const ProductSupplierClientContext = createContext<
   ProductSupplierClientContextType | undefined
>(undefined);

export const ProductSupplierClientContextProvider = ({
   children,
   serviceLoading,
   setServiceLoading,
   errorMessages,
   setErrorMessages,
}: {
   children: ReactNode;
   serviceLoading: boolean;
   setServiceLoading: React.Dispatch<React.SetStateAction<boolean>>;
   errorMessages: string;
   setErrorMessages: React.Dispatch<React.SetStateAction<string>>;
}) => {
   const { user } = useAuth();
   const uid = user?.uid;
   const [addedProduct, setAddedProduct] = useState(false);
   const [editedProduct, setEditedProduct] = useState(false);
   const [deletedProduct, setDeletedProduct] = useState(false);
   const [addedSupplier, setAddedSupplier] = useState(false);
   const [editedSupplier, setEditedSupplier] = useState(false);
   const [deletedSupplier, setDeletedSupplier] = useState(false);
   const [addedClient, setAddedClient] = useState(false);
   const [editedClient, setEditedClient] = useState(false);
   const [deletedClient, setDeletedClient] = useState(false);
   const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">(
      "idle"
   );

   const [products, setProducts] = useState<{ [key: string]: Product }>({});

   const [clients, setClients] = useState<{ [key: string]: Clients }>({});
   const [firestoreClients, setFirestoreClients] = useState<{
      [key: string]: Clients;
   }>({});

   const [suppliers, setSuppliers] = useState<{ [key: string]: Supplier }>({});
   const [firestoreSuppliers, setFirestoreSuppliers] = useState<{
      [key: string]: Supplier;
   }>({});

   const functions = getFunctions();
   const navigate = useNavigate();

   const dexieClients = useLiveQuery(() => DexieDataBase.clients.toArray(), []);
   const dexieSuppliers = useLiveQuery(
      () => DexieDataBase.suppliers.toArray(),
      []
   );

   // listen to dexie changes and merge with firestore clients
   useEffect(() => {
      if (!dexieClients) {
         return;
      }

      const merged = { ...firestoreClients };

      dexieClients.forEach((client) => {
         if (!merged[client.clientId]) {
            merged[client.clientId] = client;
         }
      });

      setClients(merged);
   }, [dexieClients, firestoreClients]);

   useEffect(() => {
      if (!dexieSuppliers) {
         return;
      }

      const merged = { ...firestoreSuppliers };

      dexieSuppliers.forEach((supplier) => {
         if (!merged[supplier.supplierId]) {
            merged[supplier.supplierId] = supplier;
         }
      });

      setSuppliers(merged);
   }, [dexieSuppliers, firestoreSuppliers]);

   // listen to firestore product change
   useEffect(() => {
      if (!user) {
         setServiceLoading(false);
         return;
      }

      if (!user?.uid) {
         console.error("User not authenticated");
         return;
      }

      const unsub = onSnapshot(
         collection(db, "users", user.uid, "products"),
         (snapshot) => {
            let products: { [key: string]: Product } = {};

            snapshot.forEach((doc) => {
               const product = doc.data() as Product;
               products[product.productId] = product;
            });

            setProducts(products);
            setServiceLoading(false);
         },
         (error) => {
            console.error("Firestore listener error:", error);

            let message = "";
            switch (error.code) {
               case "permission-denied":
                  message = "权限不足，无法访问产品数据";
                  break;
               case "unavailable":
                  message = "网络错误，请尝试重新连接";
                  break;
               case "resource-exhausted":
                  message = "服务器繁忙，请稍后再试";
                  break;
               default:
                  message = "产品加载失败，请稍后再试";
            }

            setErrorMessages(message);
            setServiceLoading(false);

            setTimeout(() => {
               setErrorMessages("");
            }, 5000);
         }
      );

      return () => {
         unsub();
      };
   }, [user?.uid]);

   // listen to firestore client changes
   useEffect(() => {
      if (!user?.uid) {
         return;
      }

      const unsub = onSnapshot(
         collection(db, "users", user.uid, "clients"),
         (snap) => {
            const map: Record<string, Clients> = {};
            snap.forEach((doc) => {
               const c = doc.data() as Clients;
               map[c.clientId] = c; // keyed by clientId
            });

            setFirestoreClients(map);
         },
         (err) => {
            console.error("Firestore listener error (clients):", err);
            let msg = "";
            switch (err.code) {
               case "permission-denied":
                  msg = "权限不足，无法访问客户数据";
                  break;
               case "unavailable":
                  msg = "网络错误，请尝试重新连接";
                  break;
               case "resource-exhausted":
                  msg = "服务器繁忙，请稍后再试";
                  break;
               default:
                  msg = "客户加载失败，请稍后再试";
            }
            console.error(msg);
         }
      );

      return unsub;
   }, [user?.uid]);

   // listen to firestore supplier changes
   useEffect(() => {
      if (!user?.uid) {
         return;
      }

      const unsub = onSnapshot(
         collection(db, "users", user.uid, "suppliers"),
         (snap) => {
            const map: Record<string, Supplier> = {};
            snap.forEach((doc) => {
               const c = doc.data() as Supplier;
               map[c.supplierId] = c;
            });

            setFirestoreSuppliers(map);
         },
         (err) => {
            console.error("Firestore listener error (suppliers):", err);
            let msg = "";
            switch (err.code) {
               case "permission-denied":
                  msg = "权限不足，无法访问客户数据";
                  break;
               case "unavailable":
                  msg = "网络错误，请尝试重新连接";
                  break;
               case "resource-exhausted":
                  msg = "服务器繁忙，请稍后再试";
                  break;
               default:
                  msg = "客户加载失败，请稍后再试";
            }
            console.error(msg);
         }
      );

      return unsub;
   }, [user?.uid]);

   const addProduct = async (product: Product) => {
      try {
         setServiceLoading(true);
         const createProduct = httpsCallable(functions, "createProduct");
         const response: any = await createProduct(product);

         if (response.data.success) {
            setAddedProduct(true);
            setServiceLoading(false);
         }
      } catch (err) {
         console.error("Error calling createProduct function: ", err);
         setServiceLoading(false);
         setAddedProduct(false);
      }
   };

   const editProduct = async (product: any) => {
      try {
         const editProduct = httpsCallable(functions, "editProduct");
         const response: any = await editProduct(product);

         if (response.data.success) {
            setServiceLoading(false);
            setEditedProduct(true);
         }
      } catch (err) {
         console.error(err);
         setEditedProduct(false);
         setServiceLoading(false);
      }
   };

   const deleteProducts = async (productId: string[]) => {
      try {
         setServiceLoading(true);

         const deleteProducts = httpsCallable(functions, "deleteProducts");
         const response: any = await deleteProducts({
            productIds: productId,
         });

         if (response.data.success) {
            setServiceLoading(false);
            setDeletedProduct(true);
            navigate(-1);
         }
      } catch (err) {
         console.error("error in deletion", err);
         setServiceLoading(false);
      }
   };

   const addSupplier = async (supplier: any) => {
      try {
         setServiceLoading(true);
         const editProduct = httpsCallable(functions, "addSupplier");
         const response: any = await editProduct(supplier);

         if (response.data.success) {
            setServiceLoading(false);
            setErrorMessages("添加成功");
         }
      } catch (err) {
         setServiceLoading(false);

         const message =
            typeof err === "string" ? err : (err as any)?.message ?? "未知错误";

         setErrorMessages(message);

         console.error("Failed to add client: " + err);
      }
   };

   const editSupplier = async (supplier: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEditedSupplier(true);
   };

   const deleteSupplier = async (supplierId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDeletedSupplier(true);
   };

   const addClient = async (client: any) => {
      try {
         setServiceLoading(true);

         const addNewClient = httpsCallable(functions, "addClient");
         const response: any = await addNewClient(client);

         if (response.data.success) {
            setAddedClient(true);
            setServiceLoading(false);

            setErrorMessages("添加成功");
         }
      } catch (err: any) {
         setServiceLoading(false);

         const message =
            typeof err === "string" ? err : err?.message ?? "未知错误";

         setErrorMessages(message);

         console.error("Failed to add client: " + err);
      }
   };

   const editClient = async (client: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEditedClient(true);
   };

   const deleteClient = async (clientId: string) => {
      try {
         setServiceLoading(true);

         const deleteProducts = httpsCallable(functions, "deleteClient");
         const response: any = await deleteProducts({
            clientId: clientId,
         });

         if (response.data.success) {
            setServiceLoading(false);
            setDeletedClient(true);
         }
      } catch (err) {
         console.error("error in deletion", err);
         setServiceLoading(false);
      }
   };

   async function getClients(): Promise<Object> {
      try {
         const clientsSnap = await getDocs(
            collection(db, "users", uid ? uid : "", "clients")
         );
         const clients = clientsSnap.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
         }, {} as { [key: string]: any });

         setClients(clients);
         return clients;
      } catch (error) {
         console.error("Error fetching clients:", error);
         return {};
      }
   }

   async function getSuppliers(): Promise<Object> {
      try {
         const suppliersSnap = await getDocs(
            collection(db, "users", uid ? uid : "", "suppliers")
         );
         const suppliers = suppliersSnap.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
         }, {} as { [key: string]: any });

         setSuppliers(suppliers);
         return suppliers;
      } catch (error) {
         console.error("Error fetching suppliers:", error);
         return {};
      }
   }

   async function toggleSaveUnsaveProduct(productId: string) {
      try {
         const saveUnsavedProduct = httpsCallable(
            functions,
            "saveUnsavedProduct"
         );

         await saveUnsavedProduct(productId);
      } catch (err) {
         console.warn(err);
      }
   }

   async function syncAll(payload: SyncPayload) {
      try {
         setSyncState("syncing");

         const syncAllFn = httpsCallable<SyncPayload, { success: boolean }>(
            getFunctions(),
            "syncAll"
         );

         const { data } = await syncAllFn(payload);

         if (data?.success) {
            await Promise.all([
               DexieDataBase.products.clear(),
               DexieDataBase.suppliers.clear(),
               DexieDataBase.clients.clear(),
            ]);

            setSyncState("done");
            setErrorMessages("同步成功");
         } else {
            setErrorMessages("信息可能破坏了。");
            setSyncState("idle");
            throw new Error("Cloud function returned failure");
         }
      } catch (err: any) {
         console.error("SyncAll failed:", err);
         setErrorMessages(
            err.message || "同步失败，请稍后重试；信息可能破坏了。"
         );
         setSyncState("idle");
      }
   }

   return (
      <ProductSupplierClientContext.Provider
         value={{
            addProduct,
            editProduct,
            deleteProducts,
            addSupplier,
            editSupplier,
            deleteSupplier,
            addClient,
            editClient,
            deleteClient,
            setDeletedClient,
            getClients,
            getSuppliers,
            toggleSaveUnsaveProduct,
            addedProduct,
            setAddedProduct,
            setAddedClient,
            setAddedSupplier,
            editedProduct,
            deletedProduct,
            addedSupplier,
            editedSupplier,
            deletedSupplier,
            addedClient,
            editedClient,
            deletedClient,
            serviceLoading,
            products,
            suppliers,
            clients,
            errorMessages,
            setErrorMessages,
            syncAll,
            syncState,
         }}
      >
         {children}
      </ProductSupplierClientContext.Provider>
   );
};

export const useProductSupplierClientContext = () => {
   const context = useContext(ProductSupplierClientContext);
   if (!context) {
      throw new Error(
         "useProductSupplierClientContext must be used within a ProductSupplierClientContextProvider"
      );
   }
   return context;
};
