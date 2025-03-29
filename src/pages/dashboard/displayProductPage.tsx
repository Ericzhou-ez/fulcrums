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
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/Add-product.css";
import FloatingTocNav from "../../components/core/FloatingTocNav";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { ArrowsOut, ArrowsIn, Heart } from "phosphor-react";
import ProductDefaultImage from "../../assets/images/product-background.svg";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { MultiSelect } from "../../components/core/multiSelect";
import { typeOptions } from "../../components/dashboard/search/productFilter";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";
import { Navigate, useNavigate, useParams } from "react-router";
import Loader from "../../components/core/loader";
import { Product } from "../../types/types";
import TimeAgoTypography from "../../components/dashboard/product/timeAgoTypography";

const TOS_SECTIONS = [
   { id: "product-input", label: "产品" },
   { id: "packing-input", label: "包装" },
   { id: "supplier-input", label: "供应商" },
   { id: "client-input", label: "客户" },
   { id: "extra-input", label: "更多" },
];

const AddProductForm = ({ p }: { p: Product }) => {
   const navigate = useNavigate();
   const { isMdUp } = useThemeContext();
   const { navOpen } = useUIStateContext();
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
   const [mass, setMass] = useState(p.mass.quantity);
   const [massUnit, setMassUnit] = useState(p.mass.unit);
   const [productVolume, setProductVolume] = useState(
      p.productDimension.volume
   );
   const [productVolumeUnit, setProductVolumeUnit] = useState(
      p.productDimension.unit
   );
   const [dimensionUnit, setDimensionUnit] = useState(p.productDimension.unit);
   const [packingMass, setPackingMass] = useState(p.packingMass.packingMass);
   const [packingMassUnit, setPackingMassUnit] = useState(
      p.packingMass.packingMassUnit
   );
   const [productCatagory, setProductCatagory] = useState(p.catagory);

   const [packing, setPacking] = useState(p.packaging);
   const [packingVolume, setPackingVolume] = useState(p.packingVolume.volume);
   const [packingDimensionUnit, setPackingDimensionUnit] = useState(
      p.packingVolume.unit
   );

   const [supplierName, setSupplierName] = useState(p.supplier.name);
   const [supplierAddress, setSupplierAddress] = useState(p.supplier.address);
   const [supplierPhone, setSupplierPhone] = useState(p.supplier.phone);
   const [supplierEmail, setSupplierEmail] = useState(p.supplier.email);

   const [clientName, setClientName] = useState(p.client);
   const [additionalNotes, setAdditionalNotes] = useState(p.additionalNotes);

   const [submittingForm, setSubmittingForm] = useState(false);
   const [isFormComplete, setIsFormComplete] = useState<string | boolean>(
      false
   );
   const {
      editedProduct,
      editProduct,
      loading,
      deleteProducts,
      deletedProduct,
   } = useProductSupplierClientContext();
   const [buttonDisabled, setButtonDisabled] = useState(editedProduct);

   async function getBase64FromBlobUrl(blobUrl: string) {
      const blob = await fetch(blobUrl).then((res) => res.blob());

      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
         };
         reader.onerror = () => {
            reject(new Error("Failed to read blob as base64"));
         };

         reader.readAsDataURL(blob);
      });
   }

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
         productDimension: {
            volume: productVolume || 0,
            unit: dimensionUnit,
         },
         mass: {
            quantity: mass,
            unit: massUnit,
         },
         packaging: packing,
         packingVolume: {
            volume: packingVolume,
            unit: packingDimensionUnit,
         },
         packingMass: {
            quantity: packingMass,
            unit: packingMassUnit,
         },
         saved: saved,
         updatedAt: new Date().toISOString(),
         supplier: {
            name: supplierName,
            phone: supplierPhone,
            address: supplierAddress,
            email: supplierEmail,
         },
         additionalNotes: additionalNotes,
         catagory: productCatagory,
         client: clientName,
         currency: currency,
         productId: p.productId,
      });
   }

   async function handleProductDeletion() {
      await deleteProducts([p.productId]);
      return;
   }

   useEffect(() => {
      if (deletedProduct) {
         navigate(-1);
      }
   }, [deletedProduct, navigate]);

   useEffect(() => {
      const missing = [];

      if (!productChineseName) missing.push("产品中文名");
      if (!productEnglishName) missing.push("产品英文名");
      if (!unitPrice) missing.push("单价");
      if (!packing) missing.push("包装方式");
      if (!productCatagory) missing.push("产品类别");
      if (!packingVolume) missing.push("包装体积");
      if (!packingMass) missing.push("包装重量");
      if (!supplierName) missing.push("供应商名称");
      if (!clientName) missing.push("客户名称");
      if (src === ProductDefaultImage) missing.push("产品图片");

      const isUnchanged =
         productChineseName === p?.productChineseName &&
         productEnglishName === p?.productEnglishName &&
         unitPrice === p?.unitPrice &&
         mass === p?.mass?.quantity &&
         productVolume === p?.productDimension?.volume &&
         packing === p?.packaging &&
         productCatagory === p?.catagory &&
         packingVolume === p?.packingVolume?.volume &&
         packingMass === p?.packingMass?.packingMass &&
         supplierName === p?.supplier?.name &&
         clientName === p?.client &&
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
      mass,
      productVolume,
      productCatagory,
      packingMass,
      packingVolume,
      supplierName,
      clientName,
      src,
      additionalNotes,
   ]);

   useEffect(() => {
      if (isFormComplete === true && editedProduct === true) {
         setTimeout(() => {
            setButtonDisabled(true);
         }, 2000);
      }
   }, [isFormComplete, editedProduct]);

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
                  sx={{ my: 2 }}
               />

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="产品英文名"
                  required
                  size="medium"
                  value={productEnglishName}
                  onChange={(e) => setProductEnglishName(e.target.value)}
                  sx={{ my: 2 }}
               />

               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="单价"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                  required
                  size="small"
                  sx={{ my: 2 }}
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
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                  sx={{ my: 2 }}
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

               <Box
                  sx={{
                     display: { xs: "block", sm: "flex" },
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
                  gap={2}
               >
                  <TextField
                     fullWidth
                     inputProps={{ maxLength: 20 }}
                     label="体积"
                     type="number"
                     size="small"
                     value={productVolume}
                     onChange={(e) =>
                        setProductVolume(parseFloat(e.target.value))
                     }
                     sx={{ my: 2 }}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="start">
                              <IconButton color="primary">
                                 <Typography>
                                    {productVolumeUnit + "³"}
                                 </Typography>
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />

                  <MultiSelect
                     label="类别"
                     options={typeOptions}
                     value={productCatagory}
                     onChange={(value: string) => setProductCatagory(value)}
                  />
               </Box>
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
                  onChange={(e) => setPacking(parseFloat(e.target.value))}
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

               <TextField
                  inputProps={{ maxLength: 20 }}
                  fullWidth
                  label="包装重量"
                  type="number"
                  size="small"
                  value={packingMass}
                  onChange={(e) => setPackingMass(parseFloat(e.target.value))}
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

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 20 }}
                  label="包装体积"
                  type="number"
                  value={packingVolume}
                  onChange={(e) => {
                     setPackingVolume(parseFloat(e.target.value));
                  }}
                  required
                  size="small"
                  sx={{ my: 2 }}
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="start">
                           <IconButton color="primary">
                              <Typography>
                                 {packingDimensionUnit + "³"}
                              </Typography>
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

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="供应商名称"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  sx={{ my: 1 }}
                  disabled
               />
               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="地址"
                  size="small"
                  value={supplierAddress}
                  sx={{ my: 1 }}
                  disabled
               />

               <Box sx={{ display: "flex", gap: 2, my: 1 }}>
                  <TextField
                     inputProps={{ maxLength: 20 }}
                     fullWidth
                     label="电话号码"
                     size="small"
                     value={supplierPhone}
                     onChange={(e) => setSupplierPhone(e.target.value)}
                     disabled
                  />
                  <TextField
                     inputProps={{ maxLength: 50 }}
                     fullWidth
                     label="电子邮件"
                     size="small"
                     value={supplierEmail}
                     onChange={(e) => setSupplierEmail(e.target.value)}
                     disabled
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

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="客户"
                  required
                  helperText="如果自动补全中没有该客户，请直接输入"
                  value={clientName}
                  disabled
                  sx={{ my: 1 }}
               />
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
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="最多200个字符"
                  inputProps={{ maxLength: 200 }}
                  helperText={`${additionalNotes.length}/200`}
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
         <FloatingTocNav
            sections={TOS_SECTIONS}
            defaultWidth="30"
            hoveredWidth="120"
         />

         {loading && <Loading />}

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
                  editedProduct && <Alert severity="success">更改成功 :)</Alert>
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

const AddProductPage = () => {
   const params = useParams();
   const { productId } = params;
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();

   const { getProducts, productLoading, products } =
      useProductSupplierClientContext();

   useEffect(() => {
      async function handleGetProduct() {
         await getProducts();
      }
      handleGetProduct();
   }, []);

   useEffect(() => {
      document.title = "Fulcrums | 添加产品";
   }, []);

   if (productLoading || !productId || !products[productId]) {
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

         <AddProductForm p={curProduct} />

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

export default AddProductPage;

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
                  height: isExpanded ? "100%" : isMdUp ? "380px" : "200px",
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
