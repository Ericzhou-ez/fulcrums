import React, { useState, useMemo, useRef } from "react";
import {
   Typography,
   Box,
   Stack,
   Button,
   IconButton,
   Drawer,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField,
   Paper,
   Tabs,
   Tab,
   Alert,
   InputAdornment,
   Autocomplete,
   ToggleButtonGroup,
   ToggleButton,
   MenuItem,
   TablePagination,
   OutlinedInput,
} from "@mui/material";
import {
   X,
   CaretLeft,
   Swap,
   AirplaneTakeoff,
   AirplaneLanding,
   Anchor,
   Truck,
   Train,
   CalendarBlank,
   MagnifyingGlass,
} from "phosphor-react";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { Product, Clients, Incoterm, INCOTERMS } from "../../../types/types";
import type { OrderLineItem } from "./orderConfirmationDrawer";
import { parseOrderCsv, parseOrderPdf } from "../../../lib/orderFileParsers";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useThemeContext } from "../../../contexts/themeContextProvider";

type View = "entry" | "confirmation";
type EntryMode = "manual" | "upload";

interface AddOrderDrawerProps {
   open: boolean;
   onClose: () => void;
}

const PRODUCT_ROWS_PER_PAGE_OPTIONS = [5, 10, 20] as const;

const TRANSPORT_MODES = [
   { value: "sea", label: "海运", icon: <Anchor size={16} /> },
   { value: "air", label: "空运", icon: <AirplaneTakeoff size={16} /> },
   { value: "road", label: "陆运", icon: <Truck size={16} /> },
   { value: "rail", label: "铁路", icon: <Train size={16} /> },
] as const;

const AddOrderDrawer: React.FC<AddOrderDrawerProps> = ({ open, onClose }) => {
   const { clients, products, createOrder, serviceLoading, setErrorMessages } =
      useProductSupplierClientContext();
   const { isDark } = useThemeContext();
   const [view, setView] = useState<View>("entry");
   const [entryMode, setEntryMode] = useState<EntryMode>("manual");
   const [clientId, setClientId] = useState<string>("");
   const [entryQuantities, setEntryQuantities] = useState<
      Record<string, number>
   >({});
   const [confirmLineItems, setConfirmLineItems] = useState<OrderLineItem[]>(
      [],
   );
   const [editableLineItems, setEditableLineItems] = useState<OrderLineItem[]>(
      [],
   );
   const [uploadParsing, setUploadParsing] = useState(false);
   const [uploadError, setUploadError] = useState<string>("");
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [orderName, setOrderName] = useState<string>("");

   // logistics states
   const [portOfLoading, setPortOfLoading] = useState<string>("");
   const [portOfDischarge, setPortOfDischarge] = useState<string>("");
   const [transportMode, setTransportMode] = useState<
      "sea" | "air" | "road" | "rail"
   >("sea");
   const [estimatedShipmentDate, setEstimatedShipmentDate] =
      useState<string>("");
   const [incoterms, setIncoterms] = useState<Incoterm | "">("");

   const client =
      clientId && clients ? (clients[clientId] as Clients | undefined) : null;

   const clientList = useMemo(() => {
      if (!clients || typeof clients !== "object") return [];
      return Object.values(clients)
         .filter((c): c is Clients => !!c && "clientId" in c)
         .sort((a, b) =>
            (a.companyName || a.clientId || "").localeCompare(
               b.companyName || b.clientId || "",
            ),
         );
   }, [clients]);

   const clientProductIds = useMemo(
      () => (client?.productIds || []) as string[],
      [client],
   );
   const allProducts = useMemo(
      () =>
         (Object.values(products || {}).filter(Boolean) as Product[]).sort(
            (a, b) =>
               (a.productChineseName || a.productId || "").localeCompare(
                  b.productChineseName || b.productId || "",
               ),
         ),
      [products],
   );

   const [productSearchTerm, setProductSearchTerm] = useState("");
   const [productPage, setProductPage] = useState(0);
   const [productRowsPerPage, setProductRowsPerPage] = useState(10);

   const filteredProducts = useMemo(() => {
      if (!productSearchTerm.trim()) return allProducts;
      const q = productSearchTerm.trim().toLowerCase();
      return allProducts.filter(
         (p) =>
            (p.productChineseName || "").toLowerCase().includes(q) ||
            (p.productEnglishName || "").toLowerCase().includes(q) ||
            (p.productId || "").toLowerCase().includes(q),
      );
   }, [allProducts, productSearchTerm]);

   const paginatedProducts = useMemo(() => {
      const start = productPage * productRowsPerPage;
      return filteredProducts.slice(start, start + productRowsPerPage);
   }, [filteredProducts, productPage, productRowsPerPage]);

   React.useEffect(() => {
      if (!open) {
         setView("entry");
         setEntryMode("manual");
         setClientId("");
         setEntryQuantities({});
         setConfirmLineItems([]);
         setEditableLineItems([]);
         setUploadParsing(false);
         setUploadError("");
         setProductSearchTerm("");
         setProductPage(0);
         setOrderName(new Intl.DateTimeFormat("zh-CN").format(new Date()));
         setPortOfLoading("");
         setPortOfDischarge("");
         setTransportMode("sea");
         setEstimatedShipmentDate("");
         setIncoterms("");
         if (fileInputRef.current) fileInputRef.current.value = "";
      }
   }, [open]);

   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !clientId) return;
      setUploadError("");
      setUploadParsing(true);
      try {
         const clientProductIds = (client?.productIds || []) as string[];
         const validProductIds = new Set(
            clientProductIds.length > 0
               ? clientProductIds
               : Object.keys(products || {}),
         );

         if (file.name.toLowerCase().endsWith(".csv")) {
            const text = await file.text();
            const items = parseOrderCsv(text, validProductIds);
            if (items.length === 0) {
               const msg =
                  "未解析到有效行：请在各行填写「数量 (Units)」；产品可通过「ID」列或「品名/DESIGNATION CN」列识别。";
               setUploadError(msg);
               setErrorMessages(msg);
               return;
            }
            setEditableLineItems(items);
            setView("confirmation");
         } else if (file.name.toLowerCase().endsWith(".pdf")) {
            const buf = await file.arrayBuffer();
            const productIdsInOrder = [...clientProductIds].sort();
            if (productIdsInOrder.length === 0) {
               const msg = "请先为该客户分配产品，再上传 PDF";
               setUploadError(msg);
               setErrorMessages(msg);
               setUploadParsing(false);
               return;
            }
            const items = await parseOrderPdf(buf, productIdsInOrder);
            if (items.length === 0) {
               const msg =
                  "PDF 中未解析到有效数量，请确认为导出的报价 PDF 并已填写数量";
               setUploadError(msg);
               setErrorMessages(msg);
               setUploadParsing(false);
               return;
            }
            setEditableLineItems(items);
            setView("confirmation");
         } else {
            const msg = "仅支持 .csv 或 .pdf 文件";
            setUploadError(msg);
            setErrorMessages(msg);
         }
      } catch (err) {
         const msg = err instanceof Error ? err.message : "解析文件失败";
         setUploadError(msg);
         setErrorMessages(msg);
      } finally {
         setUploadParsing(false);
         e.target.value = "";
      }
   };

   const handleEntryQuantityChange = (productId: string, value: string) => {
      const num = value === "" ? 0 : parseInt(value, 10);
      if (isNaN(num) || num < 0) return;
      setEntryQuantities((prev) => ({ ...prev, [productId]: num }));
   };

   const handleReviewOrder = () => {
      const items: OrderLineItem[] = allProducts
         .filter((p) => (entryQuantities[p.productId] ?? 0) > 0)
         .map((p) => ({
            productId: p.productId,
            quantity: entryQuantities[p.productId] ?? 0,
         }));
      setConfirmLineItems(items);
      setEditableLineItems(items.map((i) => ({ ...i })));
      setView("confirmation");
   };

   const canReview =
      clientId &&
      allProducts.some((p) => (entryQuantities[p.productId] ?? 0) > 0);

   const handleBackFromConfirmation = () => {
      setView("entry");
      setEditableLineItems([]);
      setConfirmLineItems([]);
   };

   const handleConfirmationQuantityChange = (
      productId: string,
      value: string,
   ) => {
      const num = value === "" ? 0 : parseInt(value, 10);
      if (isNaN(num) || num < 0) return;
      setEditableLineItems((prev) =>
         prev.map((item) =>
            item.productId === productId
               ? { ...item, quantity: value === "" ? 0 : num }
               : item,
         ),
      );
   };

   const handleRemoveLineItem = (productId: string) => {
      setEditableLineItems((prev) =>
         prev.filter((item) => item.productId !== productId),
      );
   };

   const itemsWithQuantity = editableLineItems.filter(
      (item) => item.quantity > 0,
   );

   const handleConfirmOrder = async () => {
      if (!clientId || itemsWithQuantity.length === 0) return;
      const name =
         orderName.trim() || `订单 ${new Date().toLocaleDateString("zh-CN")}`;
      await createOrder({
         orderName: name,
         clientId,
         products: itemsWithQuantity,
         incoterms: incoterms || "",
         portOfLoading,
         portOfDischarge,
         transportMode,
         estimatedShipmentDate,
      });
      onClose();
   };

   const clientName = (client as Clients)?.companyName || clientId || "";

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         sx={{ zIndex: 5999 }}
         slotProps={{
            backdrop: {
               sx: {
                  bgcolor: "rgba(18, 18, 18, 0.1)",
                  backdropFilter: "blur(3px)",
               },
            },
         }}
      >
         <Box
            sx={{
               width: { xs: "100vw", sm: 600, md: 800 },
               display: "flex",
               flexDirection: "column",
               height: "100%",
               bgcolor: isDark ? "background.secondary" : "background.default",
            }}
         >
            {view === "entry" && (
               <>
                  <Stack
                     direction="row"
                     justifyContent="space-between"
                     alignItems="start"
                     sx={{ p: 2, flexShrink: 0 }}
                     gap={2}
                  >
                     <ModeToggle
                        entryMode={entryMode}
                        setEntryMode={setEntryMode}
                     />
                     <IconButton onClick={onClose} aria-label="关闭">
                        <X width={20} height={20} />
                     </IconButton>
                  </Stack>

                  <Box
                     sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                     }}
                  >
                     <Box sx={{ px: 2 }}>
                        <Box>
                           <Typography
                              variant="h6"
                              className="form-header"
                              sx={{
                                 fontSize: { xs: "1.2rem", md: "1.6rem" },
                                 fontWeight: 500,
                              }}
                           >
                              订单信息
                           </Typography>
                           <TextField
                              fullWidth
                              label="订单名称"
                              placeholder="例如：2024-Q1-001"
                              value={orderName}
                              onChange={(e) => setOrderName(e.target.value)}
                              size="small"
                              inputProps={{ maxLength: 120 }}
                              sx={{ my: 1 }}
                           />
                           <Typography
                              variant="h6"
                              className="form-header"
                              sx={{
                                 fontSize: { xs: "1.2rem", md: "1.6rem" },
                                 fontWeight: 500,
                                 mt: 2,
                              }}
                           >
                              客户信息
                           </Typography>

                           <Stack sx={{ flexDirection: "row" }} gap={1}>
                              <Autocomplete
                                 fullWidth
                                 options={clientList}
                                 value={
                                    clientId
                                       ? (clientList.find(
                                            (c) => c.clientId === clientId,
                                         ) ?? null)
                                       : null
                                 }
                                 onChange={(_, newValue) => {
                                    setClientId(newValue?.clientId ?? "");
                                    setEntryQuantities({});
                                 }}
                                 getOptionLabel={(c) =>
                                    c.companyName || c.clientId || ""
                                 }
                                 clearOnEscape
                                 disablePortal
                                 componentsProps={{
                                    popper: {
                                       style: { zIndex: 9999 },
                                       modifiers: [
                                          {
                                             name: "sameWidth",
                                             enabled: true,
                                             phase: "beforeWrite",
                                             fn: ({ state }) => {
                                                state.styles.popper.width = `${state.rects.reference.width}px`;
                                             },
                                          },
                                       ],
                                       sx: {
                                          mt: 0,
                                          "& .MuiAutocomplete-paper": {
                                             maxHeight: 300,
                                             overflowY: "auto",
                                             overflowX: "hidden",
                                             width: "full",
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
                                             width: "full",
                                          },
                                       },
                                    },
                                 }}
                                 sx={{
                                    "& .MuiAutocomplete-inputRoot": {
                                       paddingBottom: "2px",
                                    },
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       fullWidth
                                       inputProps={{
                                          ...params.inputProps,
                                          maxLength: 100,
                                       }}
                                       label="选择客户"
                                       placeholder="搜索或选择客户"
                                       required
                                       InputProps={{
                                          ...params.InputProps,
                                          endAdornment: clientId ? (
                                             <InputAdornment position="end">
                                                <IconButton
                                                   size="small"
                                                   onClick={(e) => {
                                                      e.stopPropagation();
                                                      setClientId("");
                                                      setEntryQuantities({});
                                                   }}
                                                   aria-label="清除客户"
                                                >
                                                   <X size={20} />
                                                </IconButton>
                                             </InputAdornment>
                                          ) : (
                                             params.InputProps.endAdornment
                                          ),
                                       }}
                                       sx={{ my: 1 }}
                                    />
                                 )}
                              />
                           </Stack>
                        </Box>

                        <Box sx={{ py: 2 }}>
                           <Typography
                              variant="h6"
                              className="form-header"
                              sx={{
                                 fontSize: { xs: "1.2rem", md: "1.6rem" },
                                 fontWeight: 500,
                              }}
                           >
                              物流信息
                           </Typography>

                           <Box
                              sx={{
                                 position: "relative",
                                 display: "flex",
                                 my: 2,
                              }}
                              gap={5}
                           >
                              <TextField
                                 inputProps={{ maxLength: 200 }}
                                 fullWidth
                                 label="装货港"
                                 aria-label="装货港"
                                 type="text"
                                 value={portOfLoading}
                                 onChange={(e) =>
                                    setPortOfLoading(e.target.value)
                                 }
                                 size="small"
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <AirplaneTakeoff />
                                       </InputAdornment>
                                    ),
                                 }}
                                 sx={{
                                    "& .MuiInputBase-root.Mui-focused .MuiInputAdornment-root":
                                       {
                                          color: "primary.main",
                                       },
                                 }}
                              />

                              <IconButton
                                 onClick={() => {
                                    const temp = portOfLoading;
                                    setPortOfLoading(portOfDischarge);
                                    setPortOfDischarge(temp);
                                 }}
                                 size="small"
                                 sx={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                    zIndex: 1,
                                    width: 35,
                                    height: 35,
                                    bgcolor: "background.paper",
                                    border: "none",
                                    borderRadius: "50%",
                                 }}
                              >
                                 <Swap size={20} />
                              </IconButton>

                              <TextField
                                 inputProps={{ maxLength: 200 }}
                                 fullWidth
                                 label="卸货港"
                                 type="text"
                                 value={portOfDischarge}
                                 aria-label="卸货港"
                                 onChange={(e) =>
                                    setPortOfDischarge(e.target.value)
                                 }
                                 size="small"
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <AirplaneLanding type="duo" />
                                       </InputAdornment>
                                    ),
                                 }}
                                 sx={{
                                    "& .MuiInputBase-root.Mui-focused .MuiInputAdornment-root":
                                       {
                                          color: "primary.main",
                                       },
                                 }}
                              />
                           </Box>

                           <Box
                              sx={{
                                 py: 1,
                                 display: "flex",
                                 flexDirection: "column",
                              }}
                              gap={2}
                           >
                              <ToggleButtonGroup
                                 value={transportMode}
                                 exclusive
                                 onChange={(_, val) =>
                                    val && setTransportMode(val)
                                 }
                                 size="small"
                                 fullWidth
                                 sx={{
                                    height: 40,
                                    mb: "12px",
                                    borderRadius: "12px",
                                    border: 0.5,
                                    borderColor: "gray",
                                    overflow: "hidden",
                                    "& .MuiToggleButton-root": {
                                       borderRadius: 0,
                                       "&:first-of-type": {
                                          borderTopLeftRadius: 12,
                                          borderBottomLeftRadius: 12,
                                       },
                                       "&:last-of-type": {
                                          borderTopRightRadius: 12,
                                          borderBottomRightRadius: 12,
                                       },
                                    },
                                 }}
                                 color="primary"
                              >
                                 {TRANSPORT_MODES.map(
                                    ({ value, label, icon }) => (
                                       <ToggleButton
                                          key={value}
                                          value={value}
                                          sx={{
                                             gap: 0.75,
                                             fontSize: "0.75rem",
                                          }}
                                          disableFocusRipple
                                       >
                                          {icon}
                                          {label}
                                       </ToggleButton>
                                    ),
                                 )}
                              </ToggleButtonGroup>

                              {/* Estimated Shipment Date */}
                              <DatePicker
                                 label="预计发货日期"
                                 value={
                                    estimatedShipmentDate
                                       ? dayjs(estimatedShipmentDate)
                                       : null
                                 }
                                 onChange={(val) =>
                                    setEstimatedShipmentDate(
                                       val ? val.format("YYYY-MM-DD") : "",
                                    )
                                 }
                                 slotProps={{
                                    textField: {
                                       size: "small",
                                       fullWidth: true,
                                       InputProps: {
                                          startAdornment: (
                                             <InputAdornment position="start">
                                                <CalendarBlank size={15} />
                                             </InputAdornment>
                                          ),
                                       },
                                       sx: {
                                          mb: "12px",
                                          "& .MuiPickersOutlinedInput-root": {
                                             borderRadius: "12px !important",
                                          },
                                          "& .MuiPickersOutlinedInput-notchedOutline":
                                             {
                                                borderRadius: "12px !important",
                                             },
                                          "& .MuiInputBase-root.Mui-focused .MuiInputAdornment-root":
                                             {
                                                color: "primary.main",
                                             },
                                       },
                                    },
                                    popper: {
                                       style: { zIndex: 9999 },
                                    },
                                 }}
                              />

                              {/* Incoterms */}
                              <TextField
                                 select
                                 label="贸易术语"
                                 value={incoterms || ""}
                                 onChange={(e) =>
                                    setIncoterms(e.target.value as Incoterm)
                                 }
                                 fullWidth
                                 size="small"
                                 sx={{ mb: "12px" }}
                                 SelectProps={{
                                    MenuProps: {
                                       PaperProps: {
                                          sx: {
                                             borderRadius: "12px",
                                             boxShadow: 8,
                                             maxHeight: 220,
                                          },
                                       },
                                       sx: { zIndex: 9999 },
                                    },
                                    displayEmpty: true,
                                 }}
                                 InputProps={{
                                    sx: {
                                       borderRadius: "12px !important",
                                    },
                                 }}
                                 variant="outlined"
                              >
                                 {INCOTERMS.map((term) => (
                                    <MenuItem key={term} value={term}>
                                       {term}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Box>
                        </Box>
                     </Box>

                     {entryMode === "upload" && (
                        <Box sx={{ px: 2, pb: 2 }}>
                           {uploadError && (
                              <Alert
                                 severity="error"
                                 onClose={() => setUploadError("")}
                                 sx={{ mb: 2 }}
                              >
                                 {uploadError}
                              </Alert>
                           )}
                           <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                           >
                              请先选择客户，再上传该客户的报价 CSV 或
                              PDF（与导出格式一致）
                           </Typography>
                           <input
                              ref={fileInputRef}
                              type="file"
                              accept=".csv,.pdf"
                              style={{ display: "none" }}
                              onChange={handleFileSelect}
                           />
                           <Button
                              variant="outlined"
                              fullWidth
                              disabled={!clientId || uploadParsing}
                              onClick={() => fileInputRef.current?.click()}
                           >
                              {uploadParsing
                                 ? "解析中…"
                                 : "选择 CSV 或 PDF 文件"}
                           </Button>
                        </Box>
                     )}

                     {entryMode === "manual" && clientId && (
                        <>
                           <Typography
                              variant="h6"
                              className="form-header"
                              sx={{
                                 fontSize: { xs: "1.2rem", md: "1.6rem" },
                                 fontWeight: 500,
                                 px: 2,
                              }}
                           >
                              产品选择
                           </Typography>

                           <Box sx={{ px: 2, pb: 1 }}>
                              <OutlinedInput
                                 value={productSearchTerm}
                                 onChange={(e) => {
                                    setProductSearchTerm(e.target.value);
                                    setProductPage(0);
                                 }}
                                 size="small"
                                 placeholder="搜索产品"
                                 startAdornment={
                                    <InputAdornment position="start">
                                       <MagnifyingGlass size={18} />
                                    </InputAdornment>
                                 }
                                 fullWidth
                                 sx={{ borderRadius: "12px" }}
                              />
                           </Box>

                           {allProducts.length === 0 ? (
                              <Box sx={{ p: 2, width: "100%" }}>
                                 <Typography color="text.secondary">
                                    暂无产品，请先添加产品。
                                 </Typography>
                              </Box>
                           ) : (
                              <>
                                 <TableContainer
                                    sx={{ overflow: "auto", height: "auto" }}
                                 >
                                    <Table size="small" stickyHeader>
                                       <TableHead>
                                          <TableRow>
                                             <TableCell
                                                align="right"
                                                sx={{ width: 56 }}
                                             />
                                             <TableCell>产品</TableCell>
                                             <TableCell
                                                align="right"
                                                sx={{ width: 120 }}
                                             >
                                                数量
                                             </TableCell>
                                          </TableRow>
                                       </TableHead>
                                       <TableBody>
                                          {paginatedProducts.map((product) => (
                                             <TableRow key={product.productId}>
                                                <TableCell
                                                   padding="none"
                                                   align="right"
                                                   sx={{
                                                      width: 56,
                                                      verticalAlign: "middle",
                                                   }}
                                                >
                                                   <Box
                                                      sx={{
                                                         width: 40,
                                                         height: 40,
                                                         borderRadius: "5px",
                                                         bgcolor:
                                                            "action.hover",
                                                         backgroundImage:
                                                            product.image
                                                               ? `url(${product.image})`
                                                               : "none",
                                                         backgroundSize:
                                                            "cover",
                                                         backgroundPosition:
                                                            "center",
                                                         ml: "auto",
                                                      }}
                                                   />
                                                </TableCell>
                                                <TableCell>
                                                   <Typography
                                                      variant="body2"
                                                      fontWeight={500}
                                                   >
                                                      {
                                                         product.productChineseName
                                                      }
                                                   </Typography>
                                                   <Typography
                                                      variant="caption"
                                                      color="text.secondary"
                                                   >
                                                      {
                                                         product.productEnglishName
                                                      }
                                                   </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                   <TextField
                                                      type="number"
                                                      size="small"
                                                      value={
                                                         entryQuantities[
                                                            product.productId
                                                         ] ?? ""
                                                      }
                                                      onChange={(e) =>
                                                         handleEntryQuantityChange(
                                                            product.productId,
                                                            e.target.value,
                                                         )
                                                      }
                                                      inputProps={{ min: 0 }}
                                                      sx={{ maxWidth: 80 }}
                                                   />
                                                </TableCell>
                                             </TableRow>
                                          ))}
                                       </TableBody>
                                    </Table>
                                 </TableContainer>
                                 <TablePagination
                                    component="div"
                                    count={filteredProducts.length}
                                    rowsPerPage={productRowsPerPage}
                                    page={productPage}
                                    onPageChange={(_, newPage) =>
                                       setProductPage(newPage)
                                    }
                                    onRowsPerPageChange={(e) => {
                                       setProductRowsPerPage(
                                          parseInt(e.target.value, 10),
                                       );
                                       setProductPage(0);
                                    }}
                                    rowsPerPageOptions={[
                                       ...PRODUCT_ROWS_PER_PAGE_OPTIONS,
                                    ]}
                                    labelRowsPerPage="每页显示:"
                                 />
                              </>
                           )}

                           <Paper
                              elevation={4}
                              sx={{
                                 position: "sticky",
                                 bottom: "0 !important",
                                 p: 2,
                                 zIndex: 9999,
                                 borderTop: 1,
                                 borderColor: "divider",
                              }}
                           >
                              <Button
                                 variant="contained"
                                 fullWidth
                                 onClick={handleReviewOrder}
                                 disabled={!canReview}
                              >
                                 确认产品与数量
                              </Button>
                           </Paper>
                        </>
                     )}
                  </Box>
               </>
            )}

            {view === "confirmation" && (
               <>
                  <Stack
                     direction="row"
                     justifyContent="space-between"
                     alignItems="center"
                     sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
                  >
                     <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.5}
                     >
                        <IconButton
                           size="small"
                           onClick={handleBackFromConfirmation}
                           aria-label="返回"
                        >
                           <CaretLeft width={20} height={20} />
                        </IconButton>
                        <Typography
                           variant="h6"
                           fontWeight={500}
                           fontSize={"1.2rem"}
                        >
                           确认订单
                        </Typography>
                     </Stack>
                     <IconButton onClick={onClose} aria-label="关闭">
                        <X width={20} height={20} />
                     </IconButton>
                  </Stack>

                  <Box sx={{ px: 2, py: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                        客户
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600}>
                        {clientName}
                     </Typography>
                  </Box>

                  <Typography
                     variant="subtitle2"
                     sx={{ px: 2, pb: 1 }}
                     color="text.secondary"
                  >
                     请确认产品与数量，可直接在下方修改
                  </Typography>

                  <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
                     <Table stickyHeader size="small">
                        <TableHead>
                           <TableRow>
                              <TableCell>产品</TableCell>
                              <TableCell align="right" sx={{ width: 120 }}>
                                 数量
                              </TableCell>
                              <TableCell padding="none" sx={{ width: 48 }} />
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {editableLineItems.map((item) => {
                              const product = products[item.productId];
                              if (!product) return null;
                              return (
                                 <TableRow key={item.productId} hover>
                                    <TableCell>
                                       <Stack
                                          direction="row"
                                          spacing={2}
                                          alignItems="center"
                                       >
                                          <Box
                                             sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 1,
                                                bgcolor: "background.level2",
                                                backgroundImage: product.image
                                                   ? `url(${product.image})`
                                                   : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                flexShrink: 0,
                                             }}
                                          />
                                          <Box>
                                             <Typography
                                                variant="body2"
                                                fontWeight={500}
                                             >
                                                {product.productChineseName}
                                             </Typography>
                                             <Typography
                                                variant="caption"
                                                color="text.secondary"
                                             >
                                                {product.productEnglishName}
                                             </Typography>
                                          </Box>
                                       </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                       <TextField
                                          type="number"
                                          size="small"
                                          value={
                                             item.quantity === 0
                                                ? ""
                                                : item.quantity
                                          }
                                          onChange={(e) =>
                                             handleConfirmationQuantityChange(
                                                item.productId,
                                                e.target.value,
                                             )
                                          }
                                          inputProps={{ min: 0 }}
                                          sx={{ maxWidth: 80 }}
                                       />
                                    </TableCell>
                                    <TableCell padding="none">
                                       <IconButton
                                          size="small"
                                          onClick={() =>
                                             handleRemoveLineItem(
                                                item.productId,
                                             )
                                          }
                                          aria-label="移除"
                                       >
                                          <X size={16} />
                                       </IconButton>
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
                        </TableBody>
                     </Table>
                  </TableContainer>

                  <Paper
                     elevation={4}
                     sx={{
                        position: "sticky",
                        bottom: 0,
                        p: 2,
                        borderTop: 1,
                        borderColor: "divider",
                     }}
                  >
                     <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                     >
                        <Typography variant="subtitle1" fontWeight={600}>
                           {itemsWithQuantity.length} 项 · 确认后创建订单
                        </Typography>
                        <Stack direction="row" spacing={1}>
                           <Button
                              variant="outlined"
                              onClick={handleBackFromConfirmation}
                              disabled={serviceLoading}
                           >
                              返回
                           </Button>
                           <Button
                              variant="contained"
                              onClick={handleConfirmOrder}
                              disabled={
                                 itemsWithQuantity.length === 0 ||
                                 serviceLoading
                              }
                           >
                              {serviceLoading ? "提交中…" : "确认订单"}
                           </Button>
                        </Stack>
                     </Stack>
                  </Paper>
               </>
            )}
         </Box>
      </Drawer>
   );
};

export default AddOrderDrawer;

interface ModeToogleProps {
   entryMode: "upload" | "manual";
   setEntryMode: React.Dispatch<React.SetStateAction<"upload" | "manual">>;
}

const ModeToggle = ({ entryMode, setEntryMode }: ModeToogleProps) => {
   return (
      <Tabs
         value={entryMode}
         onChange={(_, v) => setEntryMode(v as EntryMode)}
         sx={{
            borderBottom: 0.5,
            borderColor: "divider",
            px: 0,
            width: "100%",
            display: "flex",
            margin: "0 auto",
            placeItems: "center",
            maxWidth: "none",
         }}
      >
         <Tab
            label="上传 CSV/PDF"
            value="upload"
            disableRipple
            sx={{ flex: 1, maxWidth: "none", width: "50%" }}
         />
         <Tab
            label="手动添加"
            value="manual"
            disableRipple
            sx={{ flex: 1, maxWidth: "none", width: "50%" }}
         />
      </Tabs>
   );
};
