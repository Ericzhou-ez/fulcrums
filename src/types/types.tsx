export type Mass = {
   quantity: number;
   unit: string;
};

export type VolumetricDimensions = {
   volume: number;
   unit: "m" | "cm" | "in" | "L";
};

export type Product = {
   productId: string;
   image: string;
   productChineseName: string;
   productEnglishName: string;
   unitPrice: number;

   productDimension: VolumetricDimensions;
   mass: Mass;

   packaging: number;
   packingVolume: VolumetricDimensions;
   packingMass: Mass;

   saved: boolean;
   updatedAt: string;

   supplier: {
      name: string;
      phone: string;
      address: string;
      email: string;
   };

   additionalNotes: string;
   catagory: string;
   client: string;

   purchaseVolume?: number;
   salesVolume?: number;
};
export type ProductType = {
   productId: string;
   image: string;
   name: string;
   unitPrice: number;
   productDimension: VolumetricDimensions; // this is the CBM *********
   mass: Mass;

   packaging: string;
   packingVolume: VolumetricDimensions;
   saved: boolean;
   updatedAt: string;

   supplierName?: string; // to be made required later
   supplierId?: string; // to be made required later

   additionalNotes: string;
   catagory: string;
   purchaseVolume?: number;
   salesVolume?: number;
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
