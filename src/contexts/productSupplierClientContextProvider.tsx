import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/types";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../configs/firebase";
import { useAuth } from "./authContexts";

export type ProductSupplierClientContextType = {
   addProduct: (product: any) => Promise<void>;
   editProduct: (product: any) => Promise<void>;
   deleteProduct: (productId: string) => Promise<void>;
   addSupplier: (supplier: any) => Promise<void>;
   editSupplier: (supplier: any) => Promise<void>;
   deleteSupplier: (supplierId: string) => Promise<void>;
   addClient: (client: any) => Promise<void>;
   editClient: (client: any) => Promise<void>;
   deleteClient: (clientId: string) => Promise<void>;
   getProducts: () => Promise<Object>;
   getClients: () => Promise<Object>;
   getSuppliers: () => Promise<Object>;
   addedProduct: boolean;
   editedProduct: boolean;
   deletedProduct: boolean;
   addedSupplier: boolean;
   editedSupplier: boolean;
   deletedSupplier: boolean;
   addedClient: boolean;
   editedClient: boolean;
   deletedClient: boolean;
   loading: boolean;
   productLoading: boolean;
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
}: {
   children: ReactNode;
}) => {
   const { user } = useAuth();
   const uid = user?.uid;

   // completion states
   const [addedProduct, setAddedProduct] = useState(false);
   const [editedProduct, setEditedProduct] = useState(false);
   const [deletedProduct, setDeletedProduct] = useState(false);
   const [addedSupplier, setAddedSupplier] = useState(false);
   const [editedSupplier, setEditedSupplier] = useState(false);
   const [deletedSupplier, setDeletedSupplier] = useState(false);
   const [addedClient, setAddedClient] = useState(false);
   const [editedClient, setEditedClient] = useState(false);
   const [deletedClient, setDeletedClient] = useState(false);
   const [loading, setLoading] = useState(false);
   const [productLoading, setProductLoading] = useState(false);
   const [errorMessages, setErrorMessages] = useState<string>("");

   const [products, setProducts] = useState<{ [key: string]: any }>({});
   const [clients, setClients] = useState<{ [key: string]: any }>({});
   const [suppliers, setSuppliers] = useState<{ [key: string]: any }>({});

   const addProduct = async (product: Product) => {
      try {
         setLoading(true);
         const functions = getFunctions();
         const createProduct = httpsCallable(functions, "createProduct");
         const response: any = await createProduct(product);

         if (response.data.success) {
            setLoading(false);
            setAddedProduct(true);
         }
      } catch (err) {
         console.error("Error calling createProduct function: ", err);
         setLoading(false);
         setAddedProduct(false);
      }
   };

   const editProduct = async (product: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEditedProduct(true);
   };

   const deleteProduct = async (productId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDeletedProduct(true);
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

   async function getProducts(): Promise<Object> {
      try {
         setProductLoading(true);

         const productsSnap = await getDocs(
            collection(db, "users", uid ? uid : "", "products")
         );
         const products = productsSnap.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
         }, {} as { [key: string]: any });
         
         setProducts(products);
          setProductLoading(false);
         return products;
      } catch (error) {
         console.error("Error fetching products:", error);
         setProductLoading(false);
         setErrorMessages("无法获取产品，请稍后再试");
         return {};
      }
   }

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

   return (
      <ProductSupplierClientContext.Provider
         value={{
            addProduct,
            editProduct,
            deleteProduct,
            addSupplier,
            editSupplier,
            deleteSupplier,
            addClient,
            editClient,
            deleteClient,
            getProducts,
            getClients,
            getSuppliers,  
            addedProduct,
            editedProduct,
            deletedProduct,
            addedSupplier,
            editedSupplier,
            deletedSupplier,
            addedClient,
            editedClient,
            deletedClient,
            loading,
            productLoading,
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
