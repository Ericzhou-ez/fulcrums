export type Mass = {
   unitMassQuantity: string;
   unitMassUnit: string;
};

export type VolumetricDimensions = {
   length: string;
   width: string;
   height: string;
   packingUnit: string;
};

export type Product = {
   productId: string;
   image: string;
   productChineseName: string;
   productEnglishName: string;
   unitPrice: string;
   unitMass: Mass;
   material: string;
   hsCode: string;

   packing: string;
   packingVolume: VolumetricDimensions;
   packingMass: {
      packingMassQuantity: string;
      packingMassUnit: string;
   };

   saved: boolean;
   updatedAt: string;

   supplier: {
      supplierName: string;
      supplierPhoneNumber: string;
      supplierAddress: string;
      supplierEmail: string;
      supplierId?: string; 
   };

   additionalNotes: string;
   clients: string[]; 
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
