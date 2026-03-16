import React, {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
   useMemo,
   useCallback,
} from "react";
import {
   Product,
   Supplier,
   Clients,
   SyncPayload,
   OrderProductLineItem,
   Order,
   OrderStatus,
   OrderEditPayload,
} from "../types/types";

export type OrderCreatePayload = {
   orderName: string;
   clientId: string;
   products: OrderProductLineItem[];
   incoterms: string;
   portOfLoading: string;
   portOfDischarge: string;
   transportMode: "sea" | "air" | "road" | "rail";
   estimatedShipmentDate: string;
};

export type { OrderEditPayload };

export type ProductTableFilters = {
   searchTerm?: string;
   selectedClient?: string;
   selectedSupplier?: string;
   sortOrder?: "asc" | "desc";
   savedOnly?: boolean;
};
import { db as DexieDataBase } from "../lib/dexieUtils";
import { useAuth } from "./authContexts";
import { useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { apiClient } from "../lib/apiClient";
import { websocketClient, WebSocketMessage } from "../lib/websocketClient";

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
   deleteClientProducts: (
      productIdsToRemove: string[],
      clientId: string
   ) => Promise<void>;
   addClientProducts: (
      productIdsToAdd: string[],
      clientId: string
   ) => Promise<void>;
   getClients: () => Promise<Object>;
   getSuppliers: () => Promise<Object>;
   toggleSaveUnsaveProduct: (productId: string) => Promise<void>;
   setAddedProduct: React.Dispatch<React.SetStateAction<boolean>>;
   setAddedClient: React.Dispatch<React.SetStateAction<boolean>>;
   setAddedSupplier: React.Dispatch<React.SetStateAction<boolean>>;
   setDeletedClient: React.Dispatch<React.SetStateAction<boolean>>;
   setDeletedSupplier: React.Dispatch<React.SetStateAction<boolean>>;
   setEditedSupplier: React.Dispatch<React.SetStateAction<boolean>>;
   setEditedClient: React.Dispatch<React.SetStateAction<boolean>>;
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
   getFilteredProducts: (filters: ProductTableFilters) => Product[];
   getProductsPage: (
      page: number,
      pageSize: number,
      filters: ProductTableFilters
   ) => { items: Product[]; total: number };
   getRecentProducts: (limit: number) => Product[];
   getSavedProducts: (limit: number) => Product[];
   createOrder: (payload: OrderCreatePayload) => Promise<void>;
   orders: Record<string, Order>;
   editOrder: (payload: OrderEditPayload) => Promise<void>;
   deleteOrder: (orderId: string) => Promise<void>;
   updateOrderState: (orderId: string, status: OrderStatus) => Promise<void>;
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
   const [firestoreProducts, setFirestoreProducts] = useState<{
      [key: string]: Product;
   }>({});

   const [addedSupplier, setAddedSupplier] = useState(false);
   const [editedSupplier, setEditedSupplier] = useState(false);
   const [deletedSupplier, setDeletedSupplier] = useState(false);

   const [addedClient, setAddedClient] = useState(false);
   const [editedClient, setEditedClient] = useState(false);
   const [deletedClient, setDeletedClient] = useState(false);

   const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">(
      "idle"
   );

   // const [products, setProducts] = useState<{ [key: string]: Product }>({});
   const [clients, setClients] = useState<{ [key: string]: Clients }>({});
   const [firestoreClients, setFirestoreClients] = useState<{
      [key: string]: Clients;
   }>({});

   const [suppliers, setSuppliers] = useState<{ [key: string]: Supplier }>({});
   const [firestoreSuppliers, setFirestoreSuppliers] = useState<{
      [key: string]: Supplier;
   }>({});

   const [orders, setOrders] = useState<Record<string, Order>>({});

   const navigate = useNavigate();

   const dexieClients = useLiveQuery(() => DexieDataBase.clients.toArray(), []);
   const dexieSuppliers = useLiveQuery(
      () => DexieDataBase.suppliers.toArray(),
      []
   );

   // Cleanup WebSocket on unmount
   useEffect(() => {
      return () => {
         if (!user?.uid) {
            websocketClient.disconnect();
         }
      };
   }, [user?.uid]);

   // Merge firestore clients with dexie (so clients list is populated even before Dexie resolves)
   useEffect(() => {
      const merged = { ...firestoreClients };
      const fromDexie = dexieClients ?? [];
      fromDexie.forEach((client) => {
         if (client?.clientId && !merged[client.clientId]) {
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

   // Fetch products initially and listen to WebSocket updates
   useEffect(() => {
      if (!user?.uid) {
         setServiceLoading(false);
         return;
      }

      let mounted = true;

      // Initial fetch
      apiClient
         .getProducts()
         .then((productsList) => {
            if (!mounted) return;
            const productsMap: { [key: string]: Product } = {};
            productsList.forEach((product: Product) => {
               productsMap[product.productId] = product;
            });
            setFirestoreProducts(productsMap);
            setServiceLoading(false);
         })
         .catch((error) => {
            if (!mounted) return;
            console.error("Error fetching products:", error);
            setErrorMessages("产品加载失败，请稍后再试");
            setServiceLoading(false);
            setTimeout(() => setErrorMessages(""), 5000);
         });

      // WebSocket connection and listener
      websocketClient.connect().catch((error) => {
         console.error("Failed to connect WebSocket:", error);
      });

      const unsubscribe = websocketClient.subscribe((message: WebSocketMessage) => {
         if (message.type === "products") {
            // Refetch products on update
            apiClient
               .getProducts()
               .then((productsList) => {
                  if (!mounted) return;
                  const productsMap: { [key: string]: Product } = {};
                  productsList.forEach((product: Product) => {
                     productsMap[product.productId] = product;
                  });
                  setFirestoreProducts(productsMap);
               })
               .catch((error) => {
                  console.error("Error refetching products:", error);
               });
         }
      });

      return () => {
         mounted = false;
         unsubscribe();
      };
   }, [user?.uid]);

   const products = useMemo(() => {
      // Create lookup maps for efficient mapping
      const productToSupplierMap = new Map<string, string>();
      Object.values(suppliers).forEach((supplier) => {
         supplier.productIds?.forEach((productId) => {
            productToSupplierMap.set(productId, supplier.supplierId);
         });
      });

      const productToClientsMap = new Map<string, string[]>();
      Object.values(clients).forEach((client) => {
         client.productIds?.forEach((productId) => {
            if (!productToClientsMap.has(productId)) {
               productToClientsMap.set(productId, []);
            }
            productToClientsMap.get(productId)?.push(client.clientId);
         });
      });

      const augmentedProducts: { [key: string]: Product } = {};
      for (const productId in firestoreProducts) {
         const product = firestoreProducts[productId];
         augmentedProducts[productId] = {
            ...product,
            supplierId: productToSupplierMap.get(productId) || "",
            clients: productToClientsMap.get(productId) || [],
         };
      }

      return augmentedProducts;
   }, [firestoreProducts, clients, suppliers]);

   const getFilteredProducts = useCallback(
      (filters: ProductTableFilters) => {
         let data = Object.values(products);
         const {
            searchTerm = "",
            selectedClient = "all",
            selectedSupplier = "all",
            sortOrder = "desc",
            savedOnly = false,
         } = filters;

         if (savedOnly) {
            data = data.filter((p) => p.saved === true);
         }
         if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter(
               (item) =>
                  item.productEnglishName.toLowerCase().includes(lower) ||
                  item.productChineseName.includes(searchTerm) ||
                  item.hsCode.includes(searchTerm)
            );
         }
         if (selectedClient !== "all") {
            data = data.filter((p) => p.clients?.includes(selectedClient));
         }
         if (selectedSupplier !== "all") {
            data = data.filter((p) => p.supplierId === selectedSupplier);
         }
         data = [...data].sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
         });
         return data;
      },
      [products]
   );

   const getProductsPage = useCallback(
      (page: number, pageSize: number, filters: ProductTableFilters) => {
         const list = getFilteredProducts(filters);
         const start = page * pageSize;
         return {
            items: list.slice(start, start + pageSize),
            total: list.length,
         };
      },
      [getFilteredProducts]
   );

   const getRecentProducts = useCallback(
      (limit: number) => {
         return getFilteredProducts({ sortOrder: "desc" }).slice(0, limit);
      },
      [getFilteredProducts]
   );

   const getSavedProducts = useCallback(
      (limit: number) => {
         return getFilteredProducts({
            savedOnly: true,
            sortOrder: "desc",
         }).slice(0, limit);
      },
      [getFilteredProducts]
   );

   // Fetch clients initially and listen to WebSocket updates
   useEffect(() => {
      if (!user?.uid) {
         return;
      }

      let mounted = true;

      // Initial fetch
      apiClient
         .getClients()
         .then((clientsList) => {
            if (!mounted) return;
            const map: Record<string, Clients> = {};
            clientsList.forEach((c: Clients) => {
               map[c.clientId] = c;
            });
            setFirestoreClients(map);
         })
         .catch((err) => {
            console.error("Error fetching clients:", err);
         });

      // WebSocket listener
      const unsubscribe = websocketClient.subscribe((message: WebSocketMessage) => {
         if (message.type === "clients") {
            apiClient
               .getClients()
               .then((clientsList) => {
                  if (!mounted) return;
                  const map: Record<string, Clients> = {};
                  clientsList.forEach((c: Clients) => {
                     map[c.clientId] = c;
                  });
                  setFirestoreClients(map);
               })
               .catch((err) => {
                  console.error("Error refetching clients:", err);
               });
         }
      });

      return () => {
         mounted = false;
         unsubscribe();
      };
   }, [user?.uid]);

   // Fetch suppliers initially and listen to WebSocket updates
   useEffect(() => {
      if (!user?.uid) {
         return;
      }

      let mounted = true;

      // Initial fetch
      apiClient
         .getSuppliers()
         .then((suppliersList) => {
            if (!mounted) return;
            const map: Record<string, Supplier> = {};
            suppliersList.forEach((s: Supplier) => {
               map[s.supplierId] = s;
            });
            setFirestoreSuppliers(map);
         })
         .catch((err) => {
            console.error("Error fetching suppliers:", err);
         });

      // WebSocket listener
      const unsubscribe = websocketClient.subscribe((message: WebSocketMessage) => {
         if (message.type === "suppliers") {
            apiClient
               .getSuppliers()
               .then((suppliersList) => {
                  if (!mounted) return;
                  const map: Record<string, Supplier> = {};
                  suppliersList.forEach((s: Supplier) => {
                     map[s.supplierId] = s;
                  });
                  setFirestoreSuppliers(map);
               })
               .catch((err) => {
                  console.error("Error refetching suppliers:", err);
               });
         }
      });

      return () => {
         mounted = false;
         unsubscribe();
      };
   }, [user?.uid]);

   // Fetch orders initially and listen to WebSocket updates
   useEffect(() => {
      if (!user?.uid) return;

      let mounted = true;

      // Initial fetch
      apiClient
         .getOrders()
         .then((ordersList) => {
            if (!mounted) return;
            const map: Record<string, Order> = {};
            ordersList.forEach((o: Order) => {
               map[o.orderId] = o;
            });
            setOrders(map);
         })
         .catch((err) => {
            console.error("Error fetching orders:", err);
         });

      // WebSocket listener
      const unsubscribe = websocketClient.subscribe((message: WebSocketMessage) => {
         if (message.type === "orders") {
            apiClient
               .getOrders()
               .then((ordersList) => {
                  if (!mounted) return;
                  const map: Record<string, Order> = {};
                  ordersList.forEach((o: Order) => {
                     map[o.orderId] = o;
                  });
                  setOrders(map);
               })
               .catch((err) => {
                  console.error("Error refetching orders:", err);
               });
         }
      });

      return () => {
         mounted = false;
         unsubscribe();
      };
   }, [user?.uid]);

   const addProduct = async (product: Product) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.createProduct(product);

         if (response.success) {
            setAddedProduct(true);
            setServiceLoading(false);
         }
      } catch (err: any) {
         console.error("Error calling createProduct: ", err);
         setServiceLoading(false);
         setAddedProduct(false);
         setErrorMessages(err?.message || "创建产品失败");
      }
   };

   const editProduct = async (product: any) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.updateProduct(product.productId, product);

         if (response) {
            setServiceLoading(false);
            setEditedProduct(true);
         }
      } catch (err: any) {
         console.error(err);
         setEditedProduct(false);
         setServiceLoading(false);
         setErrorMessages(err?.message || "更新产品失败");
      }
   };

   const deleteProducts = async (productId: string[]) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.deleteProducts(productId);

         if (response.success) {
            setServiceLoading(false);
            setDeletedProduct(true);
            navigate(-1);
         }
      } catch (err: any) {
         console.error("error in deletion", err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "删除产品失败");
      }
   };

   const addSupplier = async (supplier: any) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.createSupplier(supplier);

         if (response.success) {
            setServiceLoading(false);
            setErrorMessages("添加成功");
         }
      } catch (err: any) {
         setServiceLoading(false);
         const message = typeof err === "string" ? err : err?.message ?? "未知错误";
         setErrorMessages(message);
         console.error("Failed to add supplier: " + err);
      }
   };

   const editSupplier = async (supplier: any) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.updateSupplier(supplier.supplierId, supplier);

         if (response) {
            setServiceLoading(false);
            setEditedSupplier(true);
         }
      } catch (err: any) {
         console.error("error in edit " + supplier, err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "更新供应商失败");
      }
   };

   const deleteSupplier = async (supplierId: string) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.deleteSupplier(supplierId);

         if (response.success) {
            setServiceLoading(false);
            setDeletedSupplier(true);
         }
      } catch (err: any) {
         console.error("error in deletion", err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "删除供应商失败");
      }
   };

   const addClient = async (client: any) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.createClient(client);

         if (response.success) {
            setAddedClient(true);
            setServiceLoading(false);
            setErrorMessages("添加成功");
         }
      } catch (err: any) {
         setServiceLoading(false);
         const message = typeof err === "string" ? err : err?.message ?? "未知错误";
         setErrorMessages(message);
         console.error("Failed to add client: " + err);
      }
   };

   const editClient = async (client: any) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.updateClient(client.clientId, client);

         if (response) {
            setServiceLoading(false);
            setEditedClient(true);
         }
      } catch (err: any) {
         console.error("error in edit " + client, err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "更新客户失败");
      }
   };

   const deleteClient = async (clientId: string) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.deleteClient(clientId);

         if (response.success) {
            setServiceLoading(false);
            setDeletedClient(true);
         }
      } catch (err: any) {
         console.error("error in deletion", err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "删除客户失败");
      }
   };

   const deleteClientProducts = async (
      productIdsToRemove: string[],
      clientId: string
   ) => {
      try {
         setServiceLoading(true);
         // Get current client to update productIds
         const client = await apiClient.getClient(clientId);
         const currentProductIds = (client.productIds || []) as string[];
         const updatedProductIds = currentProductIds.filter(
            (id) => !productIdsToRemove.includes(id)
         );
         const response = await apiClient.updateClientProducts(clientId, updatedProductIds);

         if (response.success) {
            setServiceLoading(false);
            setErrorMessages("移除成功.");
         }
      } catch (err: any) {
         console.error("error in deletion", err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "移除产品失败");
      }
   };

   const addClientProducts = async (
      productIdsToAdd: string[],
      clientId: string
   ) => {
      try {
         setServiceLoading(true);
         // Get current client to update productIds
         const client = await apiClient.getClient(clientId);
         const currentProductIds = (client.productIds || []) as string[];
         const updatedProductIds = [...new Set([...currentProductIds, ...productIdsToAdd])];
         const response = await apiClient.updateClientProducts(clientId, updatedProductIds);

         if (response.success) {
            setServiceLoading(false);
            setErrorMessages("添加成功");
         }
      } catch (err: any) {
         console.error("error in adding products", err);
         setServiceLoading(false);
         setErrorMessages(err?.message || "添加产品失败");
      }
   };

   const createOrder = async (payload: OrderCreatePayload) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.createOrder(payload);
         if (response?.success) {
            setServiceLoading(false);
            setErrorMessages("订单已创建");
         }
      } catch (err: any) {
         setServiceLoading(false);
         const message = typeof err === "string" ? err : err?.message ?? "创建订单失败";
         setErrorMessages(message);
      }
   };

   const editOrder = async (payload: OrderEditPayload) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.updateOrder(payload.orderId, payload);
         if (response) {
            setServiceLoading(false);
            setErrorMessages("订单已更新");
         }
      } catch (err: any) {
         setServiceLoading(false);
         setErrorMessages(err?.message ?? "更新订单失败");
      }
   };

   const deleteOrder = async (orderId: string) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.deleteOrder(orderId);
         if (response?.success) {
            setServiceLoading(false);
            setErrorMessages("订单已删除");
         }
      } catch (err: any) {
         setServiceLoading(false);
         setErrorMessages(err?.message ?? "删除订单失败");
      }
   };

   const updateOrderState = async (orderId: string, status: OrderStatus) => {
      try {
         setServiceLoading(true);
         const response = await apiClient.updateOrderState(orderId, status);
         if (response?.success) {
            setServiceLoading(false);
         }
      } catch (err: any) {
         setServiceLoading(false);
         setErrorMessages(err?.message ?? "更新状态失败");
      }
   };

   async function getClients(): Promise<Object> {
      try {
         const clientsList = await apiClient.getClients();
         const clientsMap: { [key: string]: any } = {};
         clientsList.forEach((client: Clients) => {
            clientsMap[client.clientId] = client;
         });
         setClients(clientsMap);
         return clientsMap;
      } catch (error) {
         console.error("Error fetching clients:", error);
         return {};
      }
   }

   async function getSuppliers(): Promise<Object> {
      try {
         const suppliersList = await apiClient.getSuppliers();
         const suppliersMap: { [key: string]: any } = {};
         suppliersList.forEach((supplier: Supplier) => {
            suppliersMap[supplier.supplierId] = supplier;
         });
         setSuppliers(suppliersMap);
         return suppliersMap;
      } catch (error) {
         console.error("Error fetching suppliers:", error);
         return {};
      }
   }

   async function toggleSaveUnsaveProduct(productId: string) {
      try {
         await apiClient.toggleSaveProduct(productId);
      } catch (err) {
         console.warn(err);
      }
   }

   async function syncAll(payload: SyncPayload) {
      try {
         setSyncState("syncing");
         const response = await apiClient.syncAll(payload);

         if (response?.success) {
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
            throw new Error("Sync returned failure");
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
            getFilteredProducts,
            getProductsPage,
            getRecentProducts,
            getSavedProducts,
            addClientProducts,
            deleteClientProducts,
            createOrder,
            orders,
            editOrder,
            deleteOrder,
            updateOrderState,
            setDeletedSupplier,
            setEditedSupplier,
            setEditedClient,
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
