export type Mass = {
   quantity: number;
   unit: string;
};

export type VolumetricDimensions = {
   height: number;
   length: number;
   unit: "m" | "cm" | "in" | "L";
   width: number;
};

export type Product = {
   productId: string; //auto generate
   image: string; //optional
   name: string; // required
   unitPrice: number; // number only unit price already implies one unit
   productDimension: VolumetricDimensions;  // this is the CBM ********* 
   mass: Mass; // per unit

   packaging: string; // unit of items per box
   packagingDimensions: VolumetricDimensions; // should be of the box | user should be allowed to input by l*w*h or just v
   saved: boolean;
   updatedAt: string;

   supplierName: string;
   supplierId: string; // maps to supplier

   additionalNotes: string;
   catagory: string; //optional (will be dorp down)
   purchaseVolume: number; //not req
   salesVolume: number; // only needed later for quotation when client indicates how many they want
};

export type Supplier = {
   supplierId: string;
   location: string;
   name: string;
   phone: string;
   updatedAt: string;
   products: { [key: string]: Product }; // key is product id
};

export type SupplierMapping = {
   [key: string]: Supplier;
};

export type Clients = {
   products: { [key: string]: Product }; //should have all details of the product  key is product id
   phoneNumber: string;
   address: string;
   contactName: string; //联系人
   additionalNotes: string;
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
