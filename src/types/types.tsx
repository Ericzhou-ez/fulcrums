export type Mass = {
   quantity: number;
   unit: string;
};

export type VolumetricDimensions = {
   height: number;
   width: number;
   length: number;
   unit: "m" | "cm" | "in" | "L";
};

export type Product = {
   productId: string;
   image: string;
   productChineseName: string;
   productEnglishName: string;
   unitPrice: number;
   unitMass: Mass;
   material: string;
   hsCode: string;

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
   client: {
      clientId: string;
      name: string;
      products: string[];
   };
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
   products: string[];
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
