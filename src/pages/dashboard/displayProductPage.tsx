import React, { useState, useEffect } from "react";
import {
   Typography,
   Box,
   TextField,
   IconButton,
   Button,
   Tooltip,
   Alert,
   Stack,
   InputAdornment,
   FormHelperText,
   Autocomplete,
   Popper,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/Add-product.css";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { ArrowsOut, ArrowsIn, Heart, X, PlusCircle } from "phosphor-react";
import ProductDefaultImage from "../../assets/images/product-background.svg";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";
import { useParams } from "react-router";
import Loader from "../../components/core/loader";
import { Product, Supplier } from "../../types/types";
import TimeAgoTypography from "../../components/dashboard/product/timeAgoTypography";
import MultipleSelectChip from "../../components/core/multiselectWithChip";
import getBase64FromBlobUrl from "../../lib/blob-to-blob64";
import {
   getSupplierFromId,
   getSupplierIdByName,
} from "../../lib/supplierHelpers";

const AddProductForm = ({ p }: { p: Product }) => {
   const { isMdUp } = useThemeContext();
   const { navOpen } = useUIStateContext();
   const {
      editedProduct,
      editProduct,
      serviceLoading,
      deleteProducts,
      suppliers,
   } = useProductSupplierClientContext();

   const [src, setSrc] = useState(p.image);
   const [saved, setSaved] = useState(p.saved);
   const [productChineseName, setProductChineseName] = useState(
      p.productChineseName
   );
   const [productEnglishName, setProductEnglishName] = useState(
      p.productEnglishName
   );
   const [unitPrice, setUnitPrice] = useState(p.unitPrice);
   const [currency, setCurrency] = useState(p.currency);
   const [unitMass, setUnitMass] = useState(p.unitMass?.unitMassQuantity ?? "");
   const [massUnit, setMassUnit] = useState(p.unitMass?.unitMassUnit ?? "g");
   const [hsCode, setHsCode] = useState(p.hsCode);
   const [material, setMaterial] = useState(p.material);

   const [packingMass, setPackingMass] = useState(
      p.packingMass?.packingMassQuantity ?? ""
   );
   const [packingMassUnit, setPackingMassUnit] = useState(
      p.packingMass?.packingMassUnit ?? "g"
   );
   const [packing, setPacking] = useState(p.packing);
   const [packingLength, setPackingLength] = useState(
      p.packingVolume?.length ?? ""
   );
   const [packingWidth, setPackingWidth] = useState(
      p.packingVolume?.width ?? ""
   );
   const [packingHeight, setPackingHeight] = useState(
      p.packingVolume?.height ?? ""
   );
   const [packingDimensionUnit, setPackingDimensionUnit] = useState(
      p.packingVolume?.packingUnit ?? "cm"
   );

   // get supplier ID
   const [supplierId, setSupplierId] = useState(p.supplierId ?? "");
   const [supplierName, setSupplierName] = useState("");
   const [supplierAddress, setSupplierAddress] = useState("");
   const [supplierPhone, setSupplierPhone] = useState("");
   const [supplierEmail, setSupplierEmail] = useState("");
   const [supplierNameInput, setSupplierNameInput] = useState("");

   const [selectedClient, setSelectedClient] = useState<string[]>(
      p.clients ?? []
   );

   const [additionalNotes, setAdditionalNotes] = useState(
      p.additionalNotes ?? ""
   );

   const [submittingForm, setSubmittingForm] = useState(false);
   const [isFormComplete, setIsFormComplete] = useState<string | boolean>(
      false
   );
   const [buttonDisabled, setButtonDisabled] = useState(editedProduct);

   const handleClear = (setter: (value: string) => void) => () => setter("");

   async function handleEditProduct() {
      setSubmittingForm(true);

      if (isFormComplete !== true) {
         return;
      }

      setButtonDisabled(true);

      const imageChanged = src.startsWith("blob:"); // blob means newly uploaded

      const base64String = imageChanged
         ? await getBase64FromBlobUrl(src)
         : "none";

      await editProduct({
         image: base64String,
         productChineseName: productChineseName,
         productEnglishName: productEnglishName,
         unitPrice: unitPrice,
         unitMass: {
            unitMassQuantity: unitMass,
            unitMassUnit: massUnit,
         },
         packing: packing,
         packingVolume: {
            length: packingLength,
            width: packingWidth,
            height: packingHeight,
            packingUnit: packingDimensionUnit,
         },
         packingMass: {
            packingMassQuantity: packingMass,
            packingMassUnit: packingMassUnit,
         },
         saved: saved,
         updatedAt: new Date().toISOString(),
         supplierId: supplierId,
         additionalNotes: additionalNotes,
         clients: selectedClient,
         currency: currency,
         hsCode: hsCode,
         material: material,
         productId: p?.productId,
      });
   }

   async function handleProductDeletion() {
      await deleteProducts([p.productId]);
      return;
   }

   useEffect(() => {
      const missing = [];

      if (!productChineseName) missing.push("产品中文名");
      if (!productEnglishName) missing.push("产品英文名");
      if (!unitPrice) missing.push("单价");
      if (!packing) missing.push("包装");
      if (!packingHeight || !packingWidth || !packingLength)
         missing.push("包装体积");
      if (!supplierName) missing.push("供应商名称");
      if (selectedClient.length === 0) missing.push("客户");
      if (src === ProductDefaultImage) missing.push("产品图片");

      const isUnchanged =
         productChineseName === p?.productChineseName &&
         productEnglishName === p?.productEnglishName &&
         unitPrice === p?.unitPrice &&
         currency === p?.currency &&
         // Unit mass
         unitMass === p?.unitMass?.unitMassQuantity &&
         massUnit === p?.unitMass?.unitMassUnit &&
         // Packing
         packing === p?.packing &&
         packingMass === p?.packingMass?.packingMassQuantity &&
         packingMassUnit === p?.packingMass?.packingMassUnit &&
         // Packing dimensions
         packingLength === p?.packingVolume?.length &&
         packingWidth === p?.packingVolume?.width &&
         packingHeight === p?.packingVolume?.height &&
         packingDimensionUnit === p?.packingVolume?.packingUnit &&
         // Supplier
         supplierId === p?.supplierId &&
         // Clients
         Array.isArray(selectedClient) &&
         Array.isArray(p?.clients) &&
         selectedClient.length === p.clients.length &&
         selectedClient.every((id) => p.clients.includes(id)) &&
         // Misc
         saved === p?.saved &&
         hsCode === p?.hsCode &&
         material === p?.material &&
         additionalNotes === p?.additionalNotes &&
         src === p?.image;

      if (missing.length > 0) {
         setIsFormComplete("请填写" + missing.join(", "));
      } else if (isUnchanged) {
         setIsFormComplete("表单未更改");
      } else {
         setIsFormComplete(true);
      }
   }, [
      productChineseName,
      productEnglishName,
      unitPrice,
      packing,
      unitMass,
      packingHeight,
      packingWidth,
      packingLength,
      hsCode,
      packingMass,
      material,
      supplierName,
      selectedClient,
      packingMass,
      src,
      additionalNotes,
      supplierId,
      additionalNotes,
   ]);

   useEffect(() => {
      if (isFormComplete === true && editedProduct === true) {
         setTimeout(() => {
            setButtonDisabled(true);
         }, 2000);
      }
   }, [isFormComplete, editedProduct]);

   useEffect(() => {
      if (!p.supplierId || Object.keys(suppliers).length === 0) return;

      const supplierDetails = getSupplierFromId(p.supplierId, suppliers);
      if (!supplierDetails) return;

      setSupplierName(supplierDetails.supplierName);
      setSupplierNameInput(supplierDetails.supplierName);
      setSupplierAddress(supplierDetails.supplierAddress ?? "");
      setSupplierPhone(supplierDetails.supplierPhoneNumber ?? "");
      setSupplierEmail(supplierDetails.supplierEmail ?? "");
   }, [suppliers, p.supplierId]);
   return (
      <React.Fragment>
         {/* -------------- 产品image -------------- */}
         <ProductImage
            src={src}
            setSrc={setSrc}
            isMdUp={isMdUp}
            saved={saved}
            setSaved={setSaved}
            time={p.updatedAt}
            alt="product-image"
         />
         <Box
            sx={{
               display: "flex",
               flexDirection: "column",
               maxWidth: "lg",
               margin: "0 auto",
               px: 2,
            }}
         >
            {/* -------------- 产品信息 -------------- */}
            <Box
               id="product-input"
               className="input-group"
               sx={{ py: { xs: 2, md: 3 } }}
            >
               <Stack
                  direction="row"
                  gap={2}
                  justifyContent="space-between"
                  alignItems="center"
               >
                  <Typography
                     variant="h6"
                     className="form-header"
                     sx={{
                        fontSize: { xs: "1.2rem", md: "1.8rem" },
                        fontWeight: 500,
                     }}
                  >
                     产品信息
                  </Typography>

                  <TimeAgoTypography timestamp={p?.updatedAt} />
               </Stack>

               <TextField
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  label="产品中文名"
                  required
                  value={productChineseName}
                  onChange={(e) => setProductChineseName(e.target.value)}
                  sx={{ my: 1.5 }}
               />

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="产品英文名"
                  required
                  size="medium"
                  value={productEnglishName}
                  onChange={(e) => setProductEnglishName(e.target.value)}
                  sx={{ my: 1.5 }}
               />

               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="单价"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                  size="small"
                  sx={{ my: 1.5 }}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <IconButton color="primary">
                              <Typography>{currency}</Typography>
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
               />

               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="重量"
                  type="number"
                  size="small"
                  value={unitMass}
                  onChange={(e) => setUnitMass(e.target.value)}
                  sx={{ my: 1.5 }}
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="start">
                           <IconButton color="primary">
                              <Typography>{massUnit}</Typography>
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
               />

               <Stack
                  direction={{ sx: "column", sm: "row" }}
                  gap={{ xs: 0, sm: 2 }}
               >
                  <TextField
                     inputProps={{ maxLength: 200 }}
                     fullWidth
                     label="HS编码"
                     type="text"
                     value={hsCode}
                     onChange={(e) => setHsCode(e.target.value)}
                     size="small"
                     InputProps={{
                        endAdornment: hsCode && (
                           <InputAdornment position="end">
                              <IconButton onClick={handleClear(setHsCode)}>
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                     sx={{ my: 1.5 }}
                  />
                  <TextField
                     inputProps={{ maxLength: 200 }}
                     fullWidth
                     label="材料"
                     type="text"
                     size="small"
                     value={material}
                     onChange={(e) => setMaterial(e.target.value)}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">
                              {material && (
                                 <IconButton onClick={handleClear(setMaterial)}>
                                    <X size={20} />
                                 </IconButton>
                              )}
                           </InputAdornment>
                        ),
                     }}
                     sx={{ my: 1.5 }}
                  />
               </Stack>

               <FormHelperText>产品ID: {p.productId}</FormHelperText>
            </Box>

            {/* -------------- 包装信息 -------------- */}
            <Box
               id="packing-input"
               className="input-group"
               sx={{ py: { xs: 2, md: 3 } }}
            >
               <Typography
                  variant="h6"
                  className="form-header"
                  sx={{
                     fontSize: { xs: "1.2rem", md: "1.8rem" },
                     fontWeight: 500,
                  }}
               >
                  包装信息
               </Typography>

               {/* 包装 */}
               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="包装"
                  type="number"
                  value={packing}
                  onChange={(e) => setPacking(e.target.value)}
                  required
                  size="small"
                  sx={{ my: 1 }}
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="start">
                           <IconButton color="primary">
                              <Typography>件/箱</Typography>
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
               />

               <Box
                  sx={{
                     display: "flex",
                     gap: 1,
                     alignItems: "center",
                     my: 1.5,
                  }}
               >
                  <TextField
                     inputProps={{ maxLength: 20 }}
                     label="长"
                     type="number"
                     size="small"
                     value={packingLength}
                     onChange={(e) => setPackingLength(e.target.value)}
                     required
                     fullWidth
                     InputProps={{
                        startAdornment: packingLength && (
                           <InputAdornment position="start">
                              <IconButton
                                 onClick={handleClear(setPackingLength)}
                              >
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <TextField
                     fullWidth
                     inputProps={{ maxLength: 20 }}
                     label="宽"
                     type="number"
                     size="small"
                     value={packingWidth}
                     onChange={(e) => setPackingWidth(e.target.value)}
                     required
                     InputProps={{
                        startAdornment: packingWidth && (
                           <InputAdornment position="start">
                              <IconButton
                                 onClick={handleClear(setPackingWidth)}
                              >
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <TextField
                     fullWidth
                     inputProps={{ maxLength: 20 }}
                     label="高"
                     type="number"
                     size="small"
                     value={packingHeight}
                     onChange={(e) => setPackingHeight(e.target.value)}
                     required
                     InputProps={{
                        startAdornment: packingHeight && (
                           <InputAdornment position="start">
                              <IconButton
                                 onClick={handleClear(setPackingHeight)}
                              >
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />

                  <IconButton color="primary">
                     <Typography>{packingDimensionUnit}</Typography>
                  </IconButton>
               </Box>

               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="包装重量"
                  type="number"
                  size="small"
                  value={packingMass}
                  onChange={(e) => setPackingMass(e.target.value)}
                  sx={{ my: 2 }}
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="start">
                           <IconButton color="primary">
                              <Typography>{packingMassUnit}</Typography>
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
               />
            </Box>

            {/* -------------- 供应商信息 -------------- */}
            <Box
               id="supplier-input"
               className="input-group"
               sx={{ py: { xs: 2, md: 3 } }}
            >
               <Typography
                  variant="h6"
                  className="form-header"
                  sx={{
                     fontSize: { xs: "1.2rem", md: "1.8rem" },
                     fontWeight: 500,
                  }}
               >
                  供应商信息
               </Typography>

               <Autocomplete
                  fullWidth
                  options={Object.values(suppliers)} 
                  getOptionLabel={(option) => option.supplierName}
                  value={
                     Object.values(suppliers).find(
                        (s) => s.supplierId === supplierId
                     ) ?? null
                  }
                  onChange={(event, newValue) => {
                     if (!newValue) return;

                     setSupplierId(newValue.supplierId);
                     setSupplierName(newValue.supplierName);
                     setSupplierNameInput(newValue.supplierName);
                     setSupplierAddress(newValue.supplierAddress ?? "");
                     setSupplierPhone(newValue.supplierPhoneNumber ?? "");
                     setSupplierEmail(newValue.supplierEmail ?? "");
                  }}
                  isOptionEqualToValue={
                     (option, value) => option.supplierId === value.supplierId 
                  }
                  clearOnEscape
                  PopperComponent={(props) => (
                     <Popper
                        {...props}
                        sx={{
                           mt: 0,
                           "& .MuiAutocomplete-paper": {
                              maxHeight: 300,
                              overflowY: "auto",
                              overflowX: "hidden",
                           },
                           "& .MuiAutocomplete-listbox": {
                              maxHeight: 300,
                              overflowY: "auto",
                              overflowX: "hidden",
                              padding: 1,
                              scrollbarWidth: "none",
                              "&::-webkit-scrollbar": {
                                 display: "none",
                              },
                           },
                        }}
                     />
                  )}
                  sx={{
                     "& .MuiAutocomplete-inputRoot": {
                        paddingBottom: "2px",
                     },
                  }}
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        fullWidth
                        inputProps={{ ...params.inputProps, maxLength: 100 }}
                        label="供应商名称"
                        required
                        InputProps={{
                           ...params.InputProps,
                           endAdornment: supplierNameInput ? (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setSupplierName("");
                                       setSupplierNameInput("");
                                    }}
                                 >
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ) : null,
                        }}
                        sx={{ my: 2 }}
                     />
                  )}
               />

               <TextField
                  disabled
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="地址"
                  size="small"
                  value={supplierAddress}
               />

               <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                  <TextField
                     disabled
                     inputProps={{ maxLength: 20 }}
                     fullWidth
                     label="电话号码"
                     size="small"
                     value={supplierPhone}
                  />
                  <TextField
                     disabled
                     inputProps={{ maxLength: 50 }}
                     fullWidth
                     label="电子邮件"
                     size="small"
                     value={supplierEmail}
                  />
               </Box>
            </Box>

            {/* -------------- 客户信息 -------------- */}
            <Box
               id="client-input"
               className="input-group"
               sx={{ py: { xs: 2, md: 3 } }}
            >
               <Typography
                  variant="h6"
                  className="form-header"
                  sx={{
                     fontSize: { xs: "1.2rem", md: "1.8rem" },
                     fontWeight: 500,
                  }}
               >
                  客户信息
               </Typography>

               <Stack sx={{ alignItems: "center", flexDirection: "row" }}>
                  <MultipleSelectChip
                     selectedClientIds={selectedClient || []}
                     setSelectedClientIds={setSelectedClient}
                  />
               </Stack>

               <FormHelperText>
                  客户ID:{" "}
                  {Array.isArray(p.clients) ? p.clients.join(", ") : "无"}
               </FormHelperText>
            </Box>

            {/* -------------- 附加信息 -------------- */}
            <Box
               id="extra-input"
               className="input-group"
               sx={{ py: { xs: 2, md: 3 } }}
            >
               <Typography
                  variant="h6"
                  className="form-header"
                  sx={{
                     fontSize: { xs: "1.2rem", md: "1.8rem" },
                     fontWeight: 500,
                  }}
               >
                  附加信息
               </Typography>

               <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="最多1000个字符"
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${additionalNotes.length}/1000`}
                  InputProps={{
                     endAdornment: additionalNotes && (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={handleClear(setAdditionalNotes)}
                           >
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 1 }}
               />
            </Box>

            <Stack direction="row" gap={2}>
               <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleEditProduct()}
                  disabled={buttonDisabled}
               >
                  更新产品
               </Button>
               <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => handleProductDeletion()}
               >
                  删除产品
               </Button>
            </Stack>
         </Box>
         {isFormComplete === true && (
            <button
               onClick={() => handleEditProduct()}
               className="glassmorphism-btn"
               disabled={buttonDisabled}
               style={{
                  position: "fixed",
                  top: "70px",
                  right: "8px",
                  zIndex: "500",
               }}
            >
               更新产品
            </button>
         )}

         {serviceLoading && <Loading />}

         {/* not only isFormComplete true but editedProduct further needs to be true */}
         {submittingForm && (
            <Box
               sx={{
                  position: "fixed",
                  top: 0,
                  zIndex: "5000",
                  width: navOpen ? "calc(100% - 240px)" : "100%",
               }}
            >
               {isFormComplete === true ? (
                  editedProduct && (
                     <Alert
                        severity="success"
                        onClose={() => setSubmittingForm(false)}
                     >
                        更改成功 :)
                     </Alert>
                  )
               ) : (
                  <Alert
                     severity="warning"
                     onClose={() => setSubmittingForm(false)}
                  >
                     {isFormComplete}
                  </Alert>
               )}
            </Box>
         )}
      </React.Fragment>
   );
};

const displayProductPage = () => {
   const params = useParams();
   const { productId } = params;
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();

   const { products } = useProductSupplierClientContext();

   useEffect(() => {
      document.title = "Fulcrums | 产品";
   }, []);

   if (!productId || !products[productId]) {
      return (
         <Box sx={{ ...mainContentStyles(navOpen), padding: "0 !important" }}>
            <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

            <Nav home={false} searchBar={true} />

            <div style={{ padding: "180px 0" }}>
               <Loader />
            </div>

            <div style={{ padding: "0 16px" }}>
               <Footer />
            </div>

            {overlay && (
               <div
                  style={{
                     position: "fixed",
                     width: "100vw",
                     height: "100vh",
                     zIndex: 500,
                     top: 0,
                     left: 0,
                     backgroundColor: "rgba(0, 0, 0, 0.06)",
                     backdropFilter: "blur(2px)",
                  }}
                  onClick={closeOverlay}
               ></div>
            )}
         </Box>
      );
   }

   const curProduct = products[productId];

   return (
      <Box sx={{ ...mainContentStyles(navOpen), padding: "0 !important" }}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav home={false} searchBar={true} />

         <AddProductForm
            p={curProduct}
         />

         <div style={{ padding: "0 16px" }}>
            <Footer />
         </div>

         {overlay && (
            <div
               style={{
                  position: "fixed",
                  width: "100vw",
                  height: "100vh",
                  zIndex: 500,
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  backdropFilter: "blur(2px)",
               }}
               onClick={closeOverlay}
            ></div>
         )}
      </Box>
   );
};

export default displayProductPage;

interface ProductImageProps {
   alt: string;
   src: string;
   setSrc: React.Dispatch<React.SetStateAction<string>>;
   isMdUp: boolean;
   saved: boolean;
   setSaved: React.Dispatch<React.SetStateAction<boolean>>;
   time: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
   alt,
   isMdUp,
   saved,
   setSaved,
   src,
   setSrc,
   time,
}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const toggleExpand = () => setIsExpanded(!isExpanded);
   const toggleLike = () => setSaved(!saved);
   const { isDark } = useThemeContext();

   // call useProductServices to upload file to firebase storage
   const handleImageChange = (event: any) => {
      const file = event.target.files[0];

      if (file) {
         const tempUrl = URL.createObjectURL(file);
         setSrc(tempUrl);
      }
   };

   const handleButtonClick = () => {
      document.getElementById("imageInput")?.click();
   };

   return (
      <Box className="product-image-container">
         <Box position="relative" sx={{ width: "100%", paddingTop: "60px" }}>
            <img
               src={src}
               alt={alt}
               className="product-image"
               style={{
                  width: "100%",
                  transition: "all 0.3s ease-in-out",
                  height: isExpanded ? "100%" : isMdUp ? "380px" : "280px",
                  objectFit: "cover",
                  display: "block",
               }}
            />

            <Box
               sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "100px",
                  background: isDark
                     ? "linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0.05) 80%, transparent 90%)"
                     : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.05) 80%, transparent 90%)",
                  pointerEvents: "none",
                  transition: "background 0.3s ease",
               }}
            />
         </Box>

         <Stack position="absolute" bottom={8} left={8}>
            <button
               className="glassmorphism-btn"
               onClick={() => handleButtonClick()}
            >
               更换图片
            </button>
            <input
               id="imageInput"
               type="file"
               accept="image/*"
               style={{ display: "none" }}
               onChange={(e) => handleImageChange(e)}
            />
         </Stack>

         <Box position="absolute" bottom={8} right={8}>
            <Tooltip title="保存">
               <IconButton onClick={toggleLike}>
                  {saved ? (
                     <Heart size={24} color="red" weight="fill" />
                  ) : (
                     <Heart size={24} />
                  )}
               </IconButton>
            </Tooltip>

            <IconButton onClick={toggleExpand}>
               {isExpanded ? (
                  <Tooltip title="缩小">
                     <ArrowsIn size={24} />
                  </Tooltip>
               ) : (
                  <Tooltip title="放大">
                     <ArrowsOut size={24} />
                  </Tooltip>
               )}
            </IconButton>
         </Box>
      </Box>
   );
};
