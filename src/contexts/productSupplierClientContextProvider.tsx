import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/types";
import { getFunctions, httpsCallable } from "firebase/functions";

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
};

const ProductSupplierClientContext = createContext<
   ProductSupplierClientContextType | undefined
>(undefined);

export const ProductSupplierClientContextProvider = ({
   children,
}: {
   children: ReactNode;
}) => {
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
