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

   supplierId: string;

   additionalNotes: string;
   clients: string[];
   currency: string;
};

export type Supplier = {
   supplierId: string;
   supplierName: string;
   supplierPhone: string;
   supplierAddress: string;
   supplierEmail: string;
};

export type SupplierMapping = {
   [key: string]: Supplier;
};

export type Clients = {
   address: string;
   clientId: string;
   companyName: string;
   contactEmail: string;
   contactName: string;
   contactPhoneNumber: string;
   eoriNumber: string;
   productIds: string[];
   updatedAt: string;
};
