import React, { useState, useEffect } from "react";
import {
   Typography,
   Box,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Tooltip,
   Autocomplete,
   Alert,
   Stack,
   Popper,
} from "@mui/material";
import { Exam, PlusCircle, X } from "phosphor-react";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/Add-product.css";
import { useThemeContext } from "../../contexts/themeContextProvider";
import { ArrowsOut, ArrowsIn, Heart } from "phosphor-react";
import ProductDefaultImage from "../../assets/images/product-background.svg";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import ProductandCompanyData from "../../data/products_companies.json";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import NewClientModal from "./addNewClient";
import MultipleSelectChip from "../../components/core/multiselectWithChip";
import getBase64FromBlobUrl from "../../lib/blob-to-blob64";
import NewSupplierModal from "../../components/dashboard/supplier/addNewSupplierModal";
import { getSupplierIdByName } from "../../lib/supplierHelpers";

const AddProductForm = () => {
   const { navOpen } = useUIStateContext();
   const { isMdUp } = useThemeContext();

   const [src, setSrc] = useState(ProductDefaultImage);
   const [saved, setSaved] = useState(false);
   const [productChineseName, setProductChineseName] = useState("");
   const [productEnglishName, setProductEnglishName] = useState("");
   const [unitPrice, setUnitPrice] = useState("");
   const [currency, setCurrency] = useState("¥"); // 切换：$, €, ¥
   const [mass, setMass] = useState("");
   const [massUnit, setMassUnit] = useState("g"); // 切换 kg <-> g
   const [hsCode, sethsCode] = useState("");
   const [material, setMaterial] = useState("");

   const [packingMass, setPackingMass] = useState("");
   const [packingMassUnit, setPackingMassUnit] = useState("g"); // 切换 kg <-> g
   const [packing, setPacking] = useState("");
   const [packingLength, setPackingLength] = useState("");
   const [packingWidth, setPackingWidth] = useState("");
   const [packingHeight, setPackingHeight] = useState("");
   const [packingDimensionUnit, setPackingDimensionUnit] = useState("cm"); // 切换 cm <-> m

   const [supplierName, setSupplierName] = useState("");
   const [supplierAddress, setSupplierAddress] = useState("");
   const [supplierPhone, setSupplierPhone] = useState("");
   const [supplierEmail, setSupplierEmail] = useState("");
   const [selectedClient, setSelectedClient] = useState<string[] | null>([]);

   const [additionalNotes, setAdditionalNotes] = useState("");
   const [submittingForm, setSubmittingForm] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
   const [selectedSupplier, setSelectedSupplier] = useState<string | null>(
      null
   );
   const [isFormComplete, setIsFormComplete] = useState<string | boolean>(
      false
   );
   const {
      addedProduct,
      addProduct,
      suppliers,
      setErrorMessages,
      setAddedProduct,
   } = useProductSupplierClientContext();
   const [buttonDisabled, setButtonDisabled] = useState(addedProduct);
   const handleClear = (setter: (value: string) => void) => () => setter("");

   const [isClientModalOpen, setIsClientModalOpen] = useState(false);
   const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
   const [supplierNames, setSupplierNames] = useState<string[]>([]);

   const closeClientModal = (): void => {
      setIsClientModalOpen((prev) => !prev);
   };

   const closeSupplierModal = (): void => {
      setIsSupplierModalOpen((prev) => !prev);
   };

   async function handleAddProduct() {
      setSubmittingForm(true);

      if (isFormComplete !== true) {
         return;
      }

      setButtonDisabled(true);

      const base64String = await getBase64FromBlobUrl(src);
      const supplierId = getSupplierIdByName(supplierName, suppliers);

      if (!supplierId) {
         console.error(`${supplierId}不是一个供应商ID`);
         setErrorMessages(`${supplierId}不是一个供应商ID`);
         return;
      }

      await addProduct({
         image: base64String,
         productChineseName: productChineseName,
         productEnglishName: productEnglishName,
         unitPrice: unitPrice,
         unitMass: {
            unitMassQuantity: mass,
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
      });
   }

   // default values
   const [forexRates, setForexRates] = useState({
      CNYtoUSD: 0.1381677,
      CNYtoEURO: 0.1269832,
   });

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

   const togglePackingUnit = () => {
      setPackingMassUnit((prev) => (prev === "kg" ? "g" : "kg"));
   };

   const togglePackingDimensionUnit = () => {
      setPackingDimensionUnit((prev) => (prev === "cm" ? "m" : "cm"));
   };

   // get product autofill res
   const getProductFromQuery = () => {
      if (productChineseName.length > 0) {
         const keys = Object.keys(ProductandCompanyData["search_by_product"]);
         const res = keys
            .filter((p) => p.includes(productChineseName))
            .filter((name) => !!name && name.trim() !== "");

         return res.slice(0, 10);
      }
      return [];
   };

   const resetPage = () => {
      setSrc(ProductDefaultImage);
      setSaved(false);
      setProductEnglishName("");
      setProductChineseName("");
      setPackingMass("");
      setUnitPrice("");
      setMass("");
      setPacking("");
      setPackingLength("");
      setPackingWidth("");
      setPackingHeight("");
      setSupplierName("");
      setSupplierAddress("");
      setSupplierPhone("");
      setSupplierEmail("");
      setSelectedClient([]);
      setSelectedProduct(null);
      setSelectedSupplier(null);
      setAdditionalNotes("");
      setIsFormComplete(false);
      setButtonDisabled(false);
      setMaterial("");
      sethsCode("");
      setSelectedSupplier(null);
   };

   // useEffect(() => {
   //    const fetchForexRates = async () => {
   //       try {
   //          const res = await fetch(
   //             "https://api.freecurrencyapi.com/v1/latest?apikey=YOUR_API_KEY&currencies=USD%2CEUR&base_currency=CNY"
   //          );
   //          // todo: replace with actual key in .env

   //          const { data } = await res.json();

   //          setForexRates({
   //             CNYtoUSD: parseFloat(data.USD),
   //             CNYtoEURO: parseFloat(data.EUR),
   //          });

   //          console.log("Fetched Rates:", data);
   //       } catch (err) {
   //          console.error("Error fetching rates: " + err);
   //          // Use fallback values if fetch fails
   //          setForexRates({
   //             CNYtoUSD: 0.1381677,
   //             CNYtoEURO: 0.1269832,
   //          });
   //       }
   //    };

   //    fetchForexRates();
   // }, []);

   useEffect(() => {
      const supplierNames = Object.values(suppliers).map(
         (supplier) => supplier.supplierName
      );

      setSupplierNames(supplierNames);
   }, [suppliers]);

   useEffect(() => {
      const selectedSupplierId =
         typeof selectedSupplier === "string" && selectedSupplier.length > 0
            ? getSupplierIdByName(selectedSupplier, suppliers)
            : null;

      if (!selectedSupplierId) return;

      const selectedSupplierData = suppliers[selectedSupplierId];

      if (!selectedSupplierData) return;

      setSupplierAddress(selectedSupplierData.supplierAddress || "");
      setSupplierPhone(selectedSupplierData.supplierPhone || "");
      setSupplierEmail(selectedSupplierData.supplierEmail || "");
   }, [selectedSupplier]);

   useEffect(() => {
      const missing = [];

      if (!productChineseName) missing.push("产品中文名");
      if (!productEnglishName) missing.push("产品英文名");
      if (!unitPrice) missing.push("单价");
      if (!packing) missing.push("包装");
      if (!packingLength || !packingWidth || !packingHeight) {
         missing.push("包装尺寸");
      }
      if (!supplierName) missing.push("供应商名称");
      if (selectedClient?.length === 0 || selectedClient === null) missing.push("客户");
      if (src === ProductDefaultImage) missing.push("产品图片");

      setIsFormComplete(missing.length ? "请填写" + missing.join(", ") : true);
   }, [
      productChineseName,
      productEnglishName,
      unitPrice,
      packing,
      supplierName,
      selectedClient,
      src,
      packingLength,
      packingWidth,
      packingHeight,
   ]);

   useEffect(() => {
      if (isFormComplete === true && addedProduct === true) {
         setTimeout(() => {
            resetPage();
            setAddedProduct(false);
            setSubmittingForm(false); 
         }, 2000);
      }
   }, [isFormComplete, addedProduct]);

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
                  inputValue={productChineseName}
                  onInputChange={(event, newInputValue) =>
                     setProductChineseName(newInputValue)
                  }
                  onChange={(event, newValue) => {
                     setSelectedProduct(newValue);
                     setProductChineseName(newValue || "");
                  }}
                  clearOnEscape
                  PopperComponent={(props) => (
                     <Popper
                        {...props}
                        modifiers={[
                           {
                              name: "offset",
                              options: {
                                 offset: [0, 4],
                              },
                           },
                        ]}
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
                        inputProps={{ ...params.inputProps, maxLength: 50 }}
                        fullWidth
                        label="产品中文名"
                        required
                        InputProps={{
                           ...params.InputProps,
                           endAdornment: productChineseName ? (
                              <InputAdornment position="end">
                                 <IconButton
                                    onClick={(event) => {
                                       event.stopPropagation();
                                       setProductChineseName("");
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

               <TextField
                  fullWidth
                  inputProps={{ maxLength: 150 }}
                  label="产品英文名"
                  required
                  size="medium"
                  value={productEnglishName}
                  onChange={(e) => setProductEnglishName(e.target.value)}
                  InputProps={{
                     endAdornment: productEnglishName && (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={handleClear(setProductEnglishName)}
                           >
                              <X size={20} />
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 2 }}
               />

               <Stack
                  direction={{ sx: "column", sm: "row" }}
                  gap={{ xs: 0, sm: 2 }}
               >
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
                              <IconButton
                                 onClick={toggleCurrency}
                                 color="primary"
                              >
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
                  <TextField
                     inputProps={{ maxLength: 20 }}
                     fullWidth
                     label="重量"
                     type="number"
                     size="small"
                     value={mass}
                     onChange={(e) => setMass(e.target.value)}
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
               </Stack>

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
                     onChange={(e) => sethsCode(e.target.value)}
                     size="small"
                     InputProps={{
                        endAdornment: hsCode && (
                           <InputAdornment position="end">
                              <IconButton onClick={handleClear(sethsCode)}>
                                 <X size={20} />
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                     sx={{ my: 2 }}
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
                     sx={{ my: 2 }}
                  />
               </Stack>
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
               <Box
                  sx={{
                     display: "flex",
                     gap: 1,
                     alignItems: "center",
                     my: 1,
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

                  <IconButton
                     onClick={togglePackingDimensionUnit}
                     color="primary"
                  >
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
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           {packingMass && (
                              <IconButton onClick={handleClear(setPackingMass)}>
                                 <X size={20} />
                              </IconButton>
                           )}
                           <Button onClick={togglePackingUnit} size="small">
                              {packingMassUnit}
                           </Button>
                        </InputAdornment>
                     ),
                  }}
                  sx={{ my: 2 }}
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
               <Stack
                  sx={{ alignItems: "center", flexDirection: "row" }}
                  gap={1}
               >
                  <Autocomplete
                     fullWidth
                     options={supplierNames}
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
                  <IconButton
                     onClick={() =>
                        setIsSupplierModalOpen(!isSupplierModalOpen)
                     }
                  >
                     <PlusCircle size={30} />
                  </IconButton>
               </Stack>

               <TextField
                  disabled
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  label="地址"
                  size="small"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  sx={{ my: 1 }}
               />
               <Box sx={{ display: "flex", gap: 2, my: 1 }}>
                  <TextField
                     disabled
                     inputProps={{ maxLength: 20 }}
                     fullWidth
                     label="电话号码"
                     size="small"
                     value={supplierPhone}
                     onChange={(e) => setSupplierPhone(e.target.value)}
                  />
                  <TextField
                     disabled
                     inputProps={{ maxLength: 50 }}
                     fullWidth
                     label="电子邮件"
                     size="small"
                     value={supplierEmail}
                     onChange={(e) => setSupplierEmail(e.target.value)}
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

               <Stack
                  sx={{ alignItems: "center", flexDirection: "row" }}
                  gap={1}
               >
                  <MultipleSelectChip
                     selectedClientIds={selectedClient || []}
                     setSelectedClientIds={setSelectedClient}
                  />

                  <IconButton
                     onClick={() => setIsClientModalOpen(!isClientModalOpen)}
                  >
                     <PlusCircle size={30} />
                  </IconButton>
               </Stack>
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
                  zIndex: "500",
               }}
            >
               保存产品
            </button>
         )}

         {/* not only isFormComplete true but productAdded further needs to be true */}
         {submittingForm && (
            <Box
               sx={{
                  position: "fixed",
                  top: 0,
                  right: 0,
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

         <NewClientModal open={isClientModalOpen} onClose={closeClientModal} />
         <NewSupplierModal
            open={isSupplierModalOpen}
            onClose={closeSupplierModal}
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
               height: isExpanded ? "100%" : isMdUp ? "380px" : "280px",
               transition: "height 0.3s ease",
               paddingTop: "60px",
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
