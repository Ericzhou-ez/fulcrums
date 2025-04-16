import React, {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
} from "react";
import { Product, ProductType, Supplier } from "../types/types";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDocs, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebase";
import { useAuth } from "./authContexts";
import { useNavigate } from "react-router";

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
   products: { [key: string]: any };
   suppliers: { [key: string]: any };
   clients: { [key: string]: any };
   errorMessages: string;
};

const ProductSupplierClientContext = createContext<
   ProductSupplierClientContextType | undefined
>(undefined);

export const ProductSupplierClientContextProvider = ({
   children,
   serviceLoading,
   setServiceLoading,
}: {
   children: ReactNode;
   serviceLoading: boolean;
   setServiceLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
   const [errorMessages, setErrorMessages] = useState<string>("");

   const [products, setProducts] = useState<{ [key: string]: ProductType }>({});
   const [clients, setClients] = useState<{ [key: string]: ClientTypes }>({});
   const [suppliers, setSuppliers] = useState<{ [key: string]: Supplier }>({});
   const functions = getFunctions();
   const navigate = useNavigate();

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
            let products: { [key: string]: ProductType } = {};

            snapshot.forEach((doc) => {
               const product = doc.data() as ProductType;
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

   const addProduct = async (product: Product) => {
      try {
         setServiceLoading(true);
         const createProduct = httpsCallable(functions, "createProduct");
         const response: any = await createProduct(product);

         if (response.data.success) {
            setServiceLoading(false);
            setAddedProduct(true);
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddedSupplier(true);
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddedClient(true);
   };

   const editClient = async (client: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEditedClient(true);
   };

   const deleteClient = async (clientId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDeletedClient(true);
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
            getClients,
            getSuppliers,
            toggleSaveUnsaveProduct,
            addedProduct,
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
