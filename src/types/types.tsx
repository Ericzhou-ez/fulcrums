export type Mass = {
   quantity: number;
   unit: string;
};

export type VolumetricDimensions = {
   volume: number;
   unit: "m" | "cm" | "in" | "L";
};

export type Product = {
   productId: string; //auto generate
   image: string; 
   name: string; 
   unitPrice: number; // number only unit price already implies one unit
   productDimension: VolumetricDimensions;  // this is the CBM ********* 
   mass: Mass; // per unit

   packaging: string; // unit of items per box
   packingVolume: VolumetricDimensions; 
   saved: boolean;
   updatedAt: string;

   supplierName: string;
   supplierId: string; 

   additionalNotes: string;
   catagory: string;
   purchaseVolume: number; 
   salesVolume: number; // only needed later for quotation when client indicates how many they want
};

export type Supplier = {
   supplierId: string;
   name: string;
   phone: string;
   address: string;
   email: string;
};

export type SupplierMapping = {
   [key: string]: Supplier;
};

export type Clients = {
   name: string;
   clientId: string;
};

export type UserType = {
   createdAt: string;
   name: string | null;
   email: string | null;
   photo: string | null;
   products: { [key: string]: Product } | null; //产品
   clients: { [key: string]: Clients } | null; //客户
   role: string | "user";
   supplier: SupplierMapping | null; //供应商
   uid: string | null;
};

export type AuthContextType = {
   user: UserType | null;
   loading: boolean;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   signedIn: boolean;
};
