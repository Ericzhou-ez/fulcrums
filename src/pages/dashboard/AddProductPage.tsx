import React, { useState, useEffect } from "react";
import {
   Typography,
   Box,
   Paper,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   FormHelperText,
} from "@mui/material";
import { Exam, X } from "phosphor-react";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/Add-product.css";
import FloatingTocNav from "../../components/core/FloatingTocNav";
import { useThemeContext } from "../../contexts/themeContextProvider";
import {
   ToggleLeft,
   ToggleRight,
   ArrowsOut,
   ArrowsIn,
   Heart,
   Plus,
} from "phosphor-react";
import ProductDefaultImage from "../../assets/images/product-background.svg";
import ExmapleProduct from "/public/demo/O1CN01pln4jM203FPjV7zaX_!!2214227246793-0-cib.220x220.jpg";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";

const TOS_SECTIONS = [
   { id: "product-input", label: "产品" },
   { id: "packing-input", label: "包装" },
   { id: "supplier-input", label: "供应商" },
   { id: "client-input", label: "客户" },
   { id: "extra-input", label: "更多" },
];

const AddProductForm = () => {
   const [productName, setProductName] = useState("");
   const [unitPrice, setUnitPrice] = useState("");
   const [currency, setCurrency] = useState("$"); // 切换：$, €, ¥
   const [mass, setMass] = useState("");
   const [massUnit, setMassUnit] = useState("kg"); // 切换 kg <-> g
   // For dimensions: either separate L/W/H OR single volume when toggled
   const [length, setLength] = useState("");
   const [width, setWidth] = useState("");
   const [height, setHeight] = useState("");
   const [volume, setVolume] = useState(""); // used when volume mode is true
   const [dimensionUnit, setDimensionUnit] = useState("cm"); // 切换 cm <-> m; volume unit will be derived (cm³ or m³)
   const [isVolumeMode, setIsVolumeMode] = useState(false); // false = 分拆模式 (L/W/H), true = 体积模式
   const [category, setCategory] = useState("");
   const [packing, setPacking] = useState("");
   const [packingLength, setPackingLength] = useState("");
   const [packingWidth, setPackingWidth] = useState("");
   const [packingHeight, setPackingHeight] = useState("");
   const [packingDimensionUnit, setPackingDimensionUnit] = useState("cm"); // 切换 cm <-> m
   const [isPackingVolumeMode, setIsPackingVolumeMode] = useState(false); // 切换为体积模式
   const [supplierName, setSupplierName] = useState("");
   const [supplierAddress, setSupplierAddress] = useState("");
   const [supplierPhone, setSupplierPhone] = useState("");
   const [supplierEmail, setSupplierEmail] = useState("");
   const [selectedClient, setSelectedClient] = useState("");
   const clients = ["客户A", "客户B", "客户C"];
   const [additionalNotes, setAdditionalNotes] = useState("");
   const handleClear = (setter: (value: string) => void) => () => setter("");

   const toggleCurrency = () => {
      setCurrency((prev) => {
         if (prev === "$") return "€";
         else if (prev === "€") return "¥";
         else return "$";
      });
   };

   const toggleMassUnit = () => {
      setMassUnit((prev) => (prev === "kg" ? "g" : "kg"));
   };

   const toggleDimensionUnit = () => {
      setDimensionUnit((prev) => (prev === "cm" ? "m" : "cm"));
   };

   const toggleVolumeMode = () => {
      setIsVolumeMode((prev) => !prev);
      // Optionally clear individual dimension fields when switching mode
      setLength("");
      setWidth("");
      setHeight("");
      setVolume("");
   };

   const togglePackingDimensionUnit = () => {
      setPackingDimensionUnit((prev) => (prev === "cm" ? "m" : "cm"));
   };

   const togglePackingVolumeMode = () => {
      setIsPackingVolumeMode((prev) => !prev);
      setPackingLength("");
      setPackingWidth("");
      setPackingHeight("");
   };

   const { isDark, isMdUp } = useThemeContext();

   return (
      <React.Fragment>
         {/* -------------- 产品image -------------- */}
         <ProductImage
            src={ProductDefaultImage}
            isMdUp={isMdUp}
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

               <TextField
                  fullWidth
                  label="产品名称"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  InputProps={{
                     endAdornment: productName && (
                        <InputAdornment position="end">
                           <IconButton onClick={handleClear(setProductName)}>
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 2 }}
               />
               {/* 单价 - 数字类型, left adornment for currency, clear button on right if text exists */}
               <TextField
                  fullWidth
                  label="单价"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                  size="small"
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <IconButton onClick={toggleCurrency}>
                              <Typography>{currency}</Typography>
                           </IconButton>
                        </InputAdornment>
                     ),
                     endAdornment: unitPrice && (
                        <InputAdornment position="end">
                           <IconButton onClick={handleClear(setUnitPrice)}>
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 2 }}
               />
               {/* 质量（重量） - 数字类型, right adornment for toggle; also include clear button before toggle if text exists */}
               <TextField
                  fullWidth
                  label="重量"
                  type="number"
                  size="small"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  required
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           {mass && (
                              <IconButton onClick={handleClear(setMass)}>
                                 <X size={20} />
                              </IconButton>
                           )}
                           <Button onClick={toggleMassUnit} size="small">
                              {massUnit}
                           </Button>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 2 }}
               />
               {/* 尺寸（长 x 宽 x 高） 或体积模式 */}
               {isVolumeMode ? (
                  // Volume mode
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "flex-sart",
                        my: 2,
                        gap: 1,
                     }}
                  >
                     <IconButton onClick={toggleVolumeMode}>
                        <ToggleRight size={22} weight="fill" />
                     </IconButton>
                     <TextField
                        label="体积"
                        type="number"
                        size="small"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        required
                     />
                     <IconButton onClick={toggleDimensionUnit}>
                        <Typography>
                           {dimensionUnit === "cm" ? "cm³" : "m³"}
                        </Typography>
                     </IconButton>
                  </Box>
               ) : (
                  // Dimension mode: three separate fields for 长, 宽, 高 with clear buttons on left
                  <Box
                     sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                        my: 2,
                     }}
                  >
                     <IconButton onClick={toggleVolumeMode}>
                        <ToggleLeft size={22} weight="fill" />
                     </IconButton>
                     <TextField
                        label="长"
                        type="number"
                        size="small"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        required
                        InputProps={{
                           startAdornment: length && (
                              <InputAdornment position="start">
                                 <IconButton onClick={handleClear(setLength)}>
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     <TextField
                        label="宽"
                        type="number"
                        size="small"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                        InputProps={{
                           startAdornment: width && (
                              <InputAdornment position="start">
                                 <IconButton onClick={handleClear(setWidth)}>
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     <TextField
                        label="高"
                        type="number"
                        size="small"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                        InputProps={{
                           startAdornment: height && (
                              <InputAdornment position="start">
                                 <IconButton onClick={handleClear(setHeight)}>
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />

                     <IconButton onClick={toggleDimensionUnit}>
                        <Typography>{dimensionUnit}</Typography>
                     </IconButton>
                  </Box>
               )}
               {/* to be loaded with multi select */}
               <TextField
                  fullWidth
                  label="产品类别"
                  size="small"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="请选择产品类别"
                  InputProps={{
                     endAdornment: category && (
                        <InputAdornment position="end">
                           <IconButton onClick={handleClear(setCategory)}>
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 1 }}
               />
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
                  fullWidth
                  label="包装"
                  type="number"
                  value={packing}
                  onChange={(e) => setPacking(e.target.value)}
                  required
                  size="small"
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           {packing && (
                              <IconButton onClick={handleClear(setPacking)}>
                                 <X size={20} />
                              </IconButton>
                           )}
                        </InputAdornment>
                     ),
                     endAdornment: (
                        <InputAdornment position="end">件/箱</InputAdornment>
                     ),
                  }}
                  sx={{ my: 1 }}
               />
               {/* 包装尺寸 */}
               {isPackingVolumeMode ? (
                  // 单一体积输入模式
                  <Box
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        my: 1,
                     }}
                  >
                     <IconButton onClick={togglePackingVolumeMode}>
                        <ToggleLeft size={22} weight="fill" />
                     </IconButton>
                     <TextField
                        label="包装体积"
                        type="number"
                        value={packingLength || packingWidth || packingHeight}
                        onChange={(e) => {}}
                        required
                        size="small"
                     />
                     <IconButton onClick={togglePackingDimensionUnit}>
                        <Typography>
                           {packingDimensionUnit === "cm" ? "cm³" : "m³"}
                        </Typography>
                     </IconButton>
                  </Box>
               ) : (
                  // 分拆模式: 长、宽、高
                  <Box
                     sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        my: 1,
                     }}
                  >
                     <IconButton onClick={togglePackingVolumeMode}>
                        <ToggleLeft size={22} weight="fill" />
                     </IconButton>
                     <TextField
                        label="长"
                        type="number"
                        size="small"
                        value={packingLength}
                        onChange={(e) => setPackingLength(e.target.value)}
                        required
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

                     <IconButton onClick={togglePackingDimensionUnit}>
                        <Typography>{packingDimensionUnit}</Typography>
                     </IconButton>
                  </Box>
               )}
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
                  label="供应商名称"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  InputProps={{
                     endAdornment: supplierName && (
                        <InputAdornment position="end">
                           <IconButton onClick={handleClear(setSupplierName)}>
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 1 }}
               />
               <TextField
                  fullWidth
                  label="地址"
                  size="small"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  InputProps={{
                     endAdornment: supplierAddress && (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={handleClear(setSupplierAddress)}
                           >
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 1 }}
               />
               <Box sx={{ display: "flex", gap: 2, my: 1 }}>
                  <TextField
                     fullWidth
                     label="电话号码"
                     size="small"
                     value={supplierPhone}
                     onChange={(e) => setSupplierPhone(e.target.value)}
                     InputProps={{
                        endAdornment: supplierPhone && (
                           <InputAdornment position="end">
                              <IconButton
                                 onClick={handleClear(setSupplierPhone)}
                              >
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <TextField
                     fullWidth
                     label="电子邮件"
                     size="small"
                     value={supplierEmail}
                     onChange={(e) => setSupplierEmail(e.target.value)}
                     InputProps={{
                        endAdornment: supplierEmail && (
                           <InputAdornment position="end">
                              <IconButton
                                 onClick={handleClear(setSupplierEmail)}
                              >
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
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
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 2,
                     my: 1,
                  }}
               >
                  <FormControl
                     required
                     sx={{
                        minWidth: { xs: "calc(100vw - 100px)", md: "800px" },
                     }}
                  >
                     <InputLabel id="client-select-label">选择客户</InputLabel>
                     <Select
                        labelId="client-select-label"
                        value={selectedClient}
                        label="选择客户"
                        onChange={(e) => setSelectedClient(e.target.value)}
                     >
                        {clients.map((client) => (
                           <MenuItem key={client} value={client}>
                              {client}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <button className="add-btn">
                     <Plus size={20} fill="filled" />
                  </button>
               </Box>
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
         </Box>

         <button
            className="glassmorphism-btn"
            style={{ position: "fixed", top: "70px", right: "8px" }}
         >
            保存产品
         </button>

         <FloatingTocNav
            sections={TOS_SECTIONS}
            defaultWidth="30"
            hoveredWidth="120"
         />
      </React.Fragment>
   );
};

const AddProductPage = () => {
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();

   useEffect(() => {
      document.title = "Fulcrums | 添加产品";
   }, []);

   return (
      <Box sx={{ ...mainContentStyles(navOpen), padding: "0 !important" }}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

         <Nav home={false} searchBar={true} />

         <AddProductForm />

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
   src: string;
   alt: string;
   isMdUp: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, isMdUp }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [liked, setLiked] = useState(false);

   const toggleExpand = () => setIsExpanded(!isExpanded);
   const toggleLike = () => setLiked(!liked);

   return (
      <Box className="product-image-container">
         <img
            src={src}
            alt={alt}
            className="product-image"
            style={{
               width: "100%",
               height: isExpanded ? "100%" : isMdUp ? "350px" : "200px",
               transition: "height 0.3s ease",
            }}
         />

         <Box position="absolute" bottom={8} left={8}>
            <button className="glassmorphism-btn">更换图片</button>
         </Box>

         <Box position="absolute" bottom={8} right={8}>
            <IconButton onClick={toggleLike}>
               {liked ? (
                  <Heart size={24} color="red" weight="fill" />
               ) : (
                  <Heart size={24} />
               )}
            </IconButton>
            <IconButton onClick={toggleExpand}>
               {isExpanded ? <ArrowsIn size={24} /> : <ArrowsOut size={24} />}
            </IconButton>
         </Box>
      </Box>
   );
};
