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
   Tooltip,
   Autocomplete,
   Alert,
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
import { MultiSelect } from "../../components/dashboard/multiSelect";
import { typeOptions } from "../../components/dashboard/productFilter";
import ProductandCompanyData from "../../data/products_companies.json";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import Loading from "../../components/core/loading";
import { useNavigate } from "react-router";

const TOS_SECTIONS = [
   { id: "product-input", label: "产品" },
   { id: "packing-input", label: "包装" },
   { id: "supplier-input", label: "供应商" },
   { id: "client-input", label: "客户" },
   { id: "extra-input", label: "更多" },
];

const AddProductForm = () => {
   const { navOpen } = useUIStateContext();
   const [src, setSrc] = useState(ProductDefaultImage);
   const [saved, setSaved] = useState(false);
   const [productName, setProductName] = useState("");
   const [unitPrice, setUnitPrice] = useState("");
   const [currency, setCurrency] = useState("¥"); // 切换：$, €, ¥
   const [mass, setMass] = useState("");
   const [massUnit, setMassUnit] = useState("g"); // 切换 kg <-> g
   // For dimensions: either separate L/W/H OR single volume when toggled
   const [length, setLength] = useState("");
   const [width, setWidth] = useState("");
   const [height, setHeight] = useState("");
   const [productVolume, setProductVolume] = useState(""); // used when volume mode is true
   const [dimensionUnit, setDimensionUnit] = useState("cm"); // 切换 cm <-> m; volume unit will be derived (cm³ or m³)
   const [productCatagory, setProductCatagory] = useState(""); // required
   const [isVolumeMode, setIsVolumeMode] = useState(false); // false = 分拆模式 (L/W/H), true = 体积模式
   const [packing, setPacking] = useState("");
   const [packingVolume, setPackingVolume] = useState("");
   const [packingLength, setPackingLength] = useState("");
   const [packingWidth, setPackingWidth] = useState("");
   const [packingHeight, setPackingHeight] = useState("");
   const [packingDimensionUnit, setPackingDimensionUnit] = useState("cm"); // 切换 cm <-> m
   const [isPackingVolumeMode, setIsPackingVolumeMode] = useState(false); // 切换为体积模式
   const [supplierName, setSupplierName] = useState("");
   const [supplierAddress, setSupplierAddress] = useState("");
   const [supplierPhone, setSupplierPhone] = useState("");
   const [supplierEmail, setSupplierEmail] = useState("");
   const [clientName, setClientName] = useState("");
   const clients = ["客户A", "客户B", "客户C"];
   const [additionalNotes, setAdditionalNotes] = useState("");
   const handleClear = (setter: (value: string) => void) => () => setter("");
   const [submittingForm, setSubmittingForm] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
   const [selectedSupplier, setSelectedSupplier] = useState<string | null>(
      null
   );
   const [selectedClient, setSelectedClient] = useState<string | null>(null);
   const [isFormComplete, setIsFormComplete] = useState<string | boolean>(
      false
   );
   const { addedProduct, addProduct, loading } =
      useProductSupplierClientContext();
   const [buttonDisabled, setButtonDisabled] = useState(addedProduct);

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

   async function handleAddProduct() {
      setSubmittingForm(true);

      if (isFormComplete !== true) {
         return;
      }

      setButtonDisabled(true);

      const base64String = await getBase64FromBlobUrl(src);
      console.log(base64String);

      addProduct({
         image: base64String,
         name: productName,
         unitPrice: unitPrice,
         productDimension: {
            volume: parseInt(productVolume),
            unit: dimensionUnit,
         },
         mass: {
            quantity: mass,
            unit: massUnit,
         },
         packaging: packing,
         packingVolume: {
            volume: parseInt(packingVolume),
            unit: packingDimensionUnit,
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
      });
   }

   useEffect(() => {
      const l = parseFloat(length);
      const w = parseFloat(width);
      const h = parseFloat(height);

      if (l > 0 && w > 0 && h > 0) {
         const volume = l * w * h;
         setProductVolume(volume.toString());
      }
   }, [length, width, height, productVolume]);

   useEffect(() => {
      const pl = parseFloat(packingLength);
      const pw = parseFloat(packingWidth);
      const ph = parseFloat(packingHeight);

      if (pl > 0 && pw > 0 && ph > 0) {
         const pVolume = pl * pw * ph;
         setPackingVolume(pVolume.toString());
      }
   }, [packingLength, packingWidth, packingHeight, packingVolume]);

   // default values
   const [forexRates, setForexRates] = useState({
      CNYtoUSD: 0.1381677,
      CNYtoEURO: 0.1269832,
   });

   useEffect(() => {
      const fetchForexRates = async () => {
         try {
            const res = await fetch(
               "https://api.freecurrencyapi.com/v1/latest?apikey=YOUR_API_KEY&currencies=USD%2CEUR&base_currency=CNY"
            );
            // todo: replace with actual key in .env

            const { data } = await res.json();

            setForexRates({
               CNYtoUSD: parseFloat(data.USD),
               CNYtoEURO: parseFloat(data.EUR),
            });

            console.log("Fetched Rates:", data);
         } catch (err) {
            console.error("Error fetching rates: " + err);
            // Use fallback values if fetch fails
            setForexRates({
               CNYtoUSD: 0.1381677,
               CNYtoEURO: 0.1269832,
            });
         }
      };

      fetchForexRates();
   }, []);

   const toggleCurrency = () => {
      const base = parseFloat(unitPrice);
      let converted = 0;
      let newCurrency = currency;
      const USDtoEURO = forexRates.CNYtoEURO / forexRates.CNYtoUSD;
      const EUROtoCNY = 1 / forexRates.CNYtoEURO;

      if (currency === "¥") {
         // Convert from CNY to USD
         converted = base * forexRates.CNYtoUSD;
         newCurrency = "$";
      } else if (currency === "$") {
         // Convert from USD to EUR
         converted = base * USDtoEURO;
         newCurrency = "€";
      } else if (currency === "€") {
         // Convert from EUR to CNY
         converted = base * EUROtoCNY;
         newCurrency = "¥";
      }
      setUnitPrice(converted.toFixed(2));
      setCurrency(newCurrency);
   };

   const toggleMassUnit = () => {
      setMassUnit((prev) => (prev === "kg" ? "g" : "kg"));
   };

   const toggleDimensionUnit = () => {
      setDimensionUnit((prev) => (prev === "cm" ? "m" : "cm"));
   };

   const toggleVolumeMode = () => {
      setIsVolumeMode((prev) => !prev);
      setLength("");
      setWidth("");
      setHeight("");
      setProductVolume("");
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

   // get product autofill res
   const getProductFromQuery = () => {
      if (productName.length >= 2) {
         const keys = Object.keys(ProductandCompanyData["search_by_product"]);
         const res = keys.filter((p) => p.includes(productName));

         return res.slice(0, 10);
      }
      return [];
   };

   const getSupplierFromQuery = () => {
      if (supplierName.length >= 2) {
         const keys = Object.keys(ProductandCompanyData["search_by_store"]);
         const res = keys.filter((p) => p.includes(supplierName));

         return res.slice(0, 10);
      }
      return [];
   };

   useEffect(() => {
      if (selectedSupplier) {
         const address =
            ProductandCompanyData["search_by_store"][
               selectedSupplier as keyof (typeof ProductandCompanyData)["search_by_store"]
            ]["Address"];
         const phoneNumber =
            ProductandCompanyData["search_by_store"][
               selectedSupplier as keyof (typeof ProductandCompanyData)["search_by_store"]
            ]["Phone Number"];

         setSupplierAddress(address);
         setSupplierPhone(`${phoneNumber}`);
      } else {
         setSupplierAddress("");
         setSupplierPhone("");
      }
   }, [selectedSupplier]);

   useEffect(() => {
      const missing = [];

      if (!productName) missing.push("产品名称");
      if (!unitPrice) missing.push("单价");
      if (!productVolume) missing.push("产品体积");
      if (!mass) missing.push("产品质量");
      if (!packing) missing.push("包装方式");
      if (!productCatagory) missing.push("产品类别");
      if (!packingVolume) missing.push("包装体积");
      if (!supplierName) missing.push("供应商名称");
      if (!clientName) missing.push("客户名称");
      if (src === ProductDefaultImage) missing.push("产品图片");

      setIsFormComplete(missing.length ? "请填写" + missing.join(", ") : true);
   }, [
      productName,
      unitPrice,
      productVolume,
      mass,
      packing,
      productCatagory,
      packingVolume,
      supplierName,
      clientName,
      src,
   ]);

   useEffect(() => {
      if (isFormComplete === true && addedProduct === true) {
         setTimeout(() => {
            resetPage();
         }, 2000);
      }
   }, [isFormComplete, addedProduct]);

   const resetPage = () => {
      setSrc(ProductDefaultImage);
      setSaved(false);
      setProductName("");
      setUnitPrice("");
      setCurrency("¥");
      setMass("");
      setMassUnit("g");
      setLength("");
      setWidth("");
      setHeight("");
      setProductVolume("");
      setDimensionUnit("cm");
      setProductCatagory("");
      setIsVolumeMode(false);
      setPacking("");
      setPackingVolume("");
      setPackingLength("");
      setPackingWidth("");
      setPackingHeight("");
      setPackingDimensionUnit("cm");
      setIsPackingVolumeMode(false);
      setSupplierName("");
      setSupplierAddress("");
      setSupplierPhone("");
      setSupplierEmail("");
      setClientName("");
      setSelectedProduct(null);
      setSelectedSupplier(null);
      setSelectedClient(null);
      setAdditionalNotes("");
      setIsFormComplete(false);
      setButtonDisabled(false);
      setSubmittingForm(false);
   };

   return (
      <React.Fragment>
         {/* -------------- 产品image -------------- */}
         <ProductImage
            src={src}
            setSrc={setSrc}
            isMdUp={isMdUp}
            saved={saved}
            setSaved={setSaved}
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

               <Autocomplete
                  freeSolo
                  options={getProductFromQuery()}
                  value={selectedProduct}
                  inputValue={productName}
                  onInputChange={(event, newInputValue) =>
                     setProductName(newInputValue)
                  }
                  onChange={(event, newValue) => {
                     setSelectedProduct(newValue);
                     setProductName(newValue || "");
                  }}
                  clearOnEscape
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        inputProps={{ ...params.inputProps, maxLength: 50 }}
                        fullWidth
                        label="产品名称"
                        required
                        InputProps={{
                           ...params.InputProps,
                           endAdornment: productName ? (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setProductName("");
                                       setSelectedProduct(null);
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
               {/* 单价 - 数字类型, left adornment for currency, clear button on right if text exists */}
               <TextField
                  inputProps={{ maxLength: 20 }}
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
                           <IconButton onClick={toggleCurrency} color="primary">
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
                  inputProps={{ maxLength: 20 }}
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
               <Box
                  sx={{
                     display: { xs: "block", sm: "flex" },
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
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
                           inputProps={{ maxLength: 20 }}
                           label="体积"
                           type="number"
                           size="small"
                           value={productVolume}
                           onChange={(e) => setProductVolume(e.target.value)}
                           required
                        />
                        <IconButton
                           onClick={toggleDimensionUnit}
                           color="primary"
                        >
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
                           inputProps={{ maxLength: 20 }}
                           label="长"
                           type="number"
                           size="small"
                           value={length}
                           onChange={(e) => setLength(e.target.value)}
                           required
                           InputProps={{
                              startAdornment: length && (
                                 <InputAdornment position="start">
                                    <IconButton
                                       onClick={handleClear(setLength)}
                                    >
                                       <X size={20} />
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           }}
                        />
                        <TextField
                           inputProps={{ maxLength: 20 }}
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
                           inputProps={{ maxLength: 20 }}
                           label="高"
                           type="number"
                           size="small"
                           value={height}
                           onChange={(e) => setHeight(e.target.value)}
                           required
                           InputProps={{
                              startAdornment: height && (
                                 <InputAdornment position="start">
                                    <IconButton
                                       onClick={handleClear(setHeight)}
                                    >
                                       <X size={20} />
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           }}
                        />

                        <IconButton
                           onClick={toggleDimensionUnit}
                           color="primary"
                        >
                           <Typography>{dimensionUnit}</Typography>
                        </IconButton>
                     </Box>
                  )}
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
                        inputProps={{ maxLength: 20 }}
                        label="包装体积"
                        type="number"
                        value={packingVolume}
                        onChange={(e) => {
                           setPackingVolume(e.target.value);
                        }}
                        required
                        size="small"
                     />
                     <IconButton
                        onClick={togglePackingDimensionUnit}
                        color="primary"
                     >
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
                        inputProps={{ maxLength: 20 }}
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

                     <IconButton
                        onClick={togglePackingDimensionUnit}
                        color="primary"
                     >
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
               <Autocomplete
                  freeSolo
                  options={getSupplierFromQuery()}
                  value={selectedSupplier}
                  inputValue={supplierName}
                  onInputChange={(event, newInputValue) =>
                     setSupplierName(newInputValue)
                  }
                  onChange={(event, newValue) => {
                     setSelectedSupplier(newValue);
                     setSupplierName(newValue || "");
                  }}
                  clearOnEscape
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        fullWidth
                        inputProps={{ ...params.inputProps, maxLength: 50 }}
                        label="供应商名称"
                        required
                        InputProps={{
                           ...params.InputProps,
                           endAdornment: supplierName ? (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setSupplierName("");
                                       setSelectedSupplier(null);
                                    }}
                                 >
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ) : null,
                        }}
                        sx={{ my: 1 }}
                     />
                  )}
               />
               <TextField
                  fullWidth
                  inputProps={{ maxLength: 50 }}
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
                     inputProps={{ maxLength: 20 }}
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
                     inputProps={{ maxLength: 50 }}
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

               <Autocomplete
                  freeSolo
                  options={clients}
                  value={selectedClient}
                  inputValue={clientName}
                  onInputChange={(event, newInputValue) =>
                     setClientName(newInputValue)
                  }
                  onChange={(event, newValue) => {
                     setSelectedClient(newValue);
                     setClientName(newValue || "");
                  }}
                  clearOnEscape
                  renderInput={(params) => (
                     <TextField
                        {...params}
                        fullWidth
                        inputProps={{ ...params.inputProps, maxLength: 50 }}
                        label="选择客户"
                        required
                        helperText="如果自动补全中没有该客户，请直接输入"
                        InputProps={{
                           ...params.InputProps,
                           endAdornment: clientName ? (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setClientName("");
                                       setSelectedClient(null);
                                    }}
                                 >
                                    <X size={20} />
                                 </IconButton>
                              </InputAdornment>
                           ) : null,
                        }}
                        sx={{ my: 1 }}
                     />
                  )}
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

            <Button
               variant="contained"
               color="primary"
               fullWidth
               onClick={() => handleAddProduct()}
               disabled={buttonDisabled}
            >
               保存产品
            </Button>
         </Box>
         {isFormComplete === true && (
            <button
               onClick={() => handleAddProduct()}
               className="glassmorphism-btn"
               disabled={buttonDisabled}
               style={{
                  position: "fixed",
                  top: "70px",
                  right: "8px",
                  zIndex: "5500",
               }}
            >
               保存产品
            </button>
         )}
         <FloatingTocNav
            sections={TOS_SECTIONS}
            defaultWidth="30"
            hoveredWidth="120"
         />

         {loading && <Loading />}

         {/* not only isFormComplete true but productAdded further needs to be true */}
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
                  addedProduct && <Alert severity="success">添加成功 :)</Alert>
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
   alt: string;
   src: string;
   setSrc: React.Dispatch<React.SetStateAction<string>>;
   isMdUp: boolean;
   saved: boolean;
   setSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductImage: React.FC<ProductImageProps> = ({
   alt,
   isMdUp,
   saved,
   setSaved,
   src,
   setSrc,
}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const toggleExpand = () => setIsExpanded(!isExpanded);
   const toggleLike = () => setSaved(!saved);

   // call useProductServices to upload file to firebase storage
   // todo implemented
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
         </Box>

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
