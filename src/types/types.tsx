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
   salesPrice: number;

   productDimension: VolumetricDimensions;
   mass: Mass;

   packaging: number;
   packingVolume: VolumetricDimensions;
   packingMass: {
      packingMass: number;
      packingMassUnit: string;
   };

   saved: boolean;
   updatedAt: string;

   supplier: {
      name: string;
      phone: string;
      address: string;
      email: string;
      supplierId: string;
   };

   additionalNotes: string;
   catagory: string;
   client: string;
   clientId: string;

   purchaseVolume?: number;
   salesVolume?: number;
   currency: string;
};

export type ProductType = {
   productId: string;
   image: string;
   productChineseName: string;
   productEnglishName: string;
   unitPrice: number;
   salesPrice: number;

   productDimension: VolumetricDimensions;
   mass: Mass;

   packaging: number;
   packingVolume: VolumetricDimensions;
   packingMass: {
      packingMass: number;
      packingMassUnit: string;
   };

   saved: boolean;
   updatedAt: string;

   supplier: {
      name: string;
      phone: string;
      address: string;
      email: string;
      supplierId: string;
   };

   additionalNotes: string;
   catagory: string;
   client: string;
   clientId: string;

   purchaseVolume?: number;
   salesVolume?: number;
   currency: string;
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
   role: string | "user";
   uid: string | null;
};

export type AuthContextType = {
   user: UserType | null;
   loading: boolean;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   signedIn: boolean;
};
