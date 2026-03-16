import React, { useState, useEffect, useMemo } from "react";
import {
   Drawer,
   Button,
   TextField,
   Stack,
   Select,
   MenuItem,
   ToggleButtonGroup,
   ToggleButton,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Box,
   Typography,
   IconButton,
   TablePagination,
   Paper,
} from "@mui/material";
import { X, Anchor, AirplaneTakeoff, Truck, Train } from "phosphor-react";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { Order, OrderStatus, Clients, INCOTERMS } from "../../../types/types";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const TRANSPORT_MODES = [
   { value: "sea" as const, label: "海运", icon: <Anchor size={16} /> },
   {
      value: "air" as const,
      label: "空运",
      icon: <AirplaneTakeoff size={16} />,
   },
   { value: "road" as const, label: "陆运", icon: <Truck size={16} /> },
   { value: "rail" as const, label: "铁路", icon: <Train size={16} /> },
];

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
   { value: "draft", label: "草稿" },
   { value: "shipped", label: "已发货" },
   { value: "customs_clearance", label: "清关中" },
   { value: "delivered", label: "已送达" },
   { value: "cancelled", label: "已取消" },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20] as const;

interface EditOrderModalProps {
   open: boolean;
   onClose: () => void;
   order: Order | null;
}

export default function EditOrderModal({
   open,
   onClose,
   order,
}: EditOrderModalProps) {
   const { clients, products, editOrder, serviceLoading } =
      useProductSupplierClientContext();
   const { isDark } = useThemeContext();

   const [orderName, setOrderName] = useState("");
   const [clientId, setClientId] = useState("");
   const [lineItems, setLineItems] = useState<
      { productId: string; quantity: number }[]
   >([]);
   const [incoterms, setIncoterms] = useState<string>("");
   const [portOfLoading, setPortOfLoading] = useState("");
   const [portOfDischarge, setPortOfDischarge] = useState("");
   const [transportMode, setTransportMode] = useState<
      "sea" | "air" | "road" | "rail"
   >("sea");
   const [estimatedShipmentDate, setEstimatedShipmentDate] = useState("");
   const [status, setStatus] = useState<OrderStatus>("draft");
   const [productPage, setProductPage] = useState(0);
   const [productRowsPerPage, setProductRowsPerPage] = useState(10);

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

   useEffect(() => {
      if (open && order) {
         setOrderName(order.orderName || "");
         setClientId(order.clientId || "");
         setLineItems(
            order.products?.length ? order.products.map((p) => ({ ...p })) : [],
         );
         setIncoterms(order.incoterms || "");
         setPortOfLoading(order.portOfLoading || "");
         setPortOfDischarge(order.portOfDischarge || "");
         setTransportMode(order.transportMode || "sea");
         setEstimatedShipmentDate(order.estimatedShipmentDate || "");
         setStatus(order.status || "draft");
         setProductPage(0);
      }
   }, [open, order]);

   const handleQuantityChange = (productId: string, value: string) => {
      const num = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0);
      setLineItems((prev) =>
         prev.map((item) =>
            item.productId === productId ? { ...item, quantity: num } : item,
         ),
      );
   };

   const itemsWithQty = lineItems.filter((item) => item.quantity > 0);
   const paginatedLineItems = useMemo(() => {
      const start = productPage * productRowsPerPage;
      return lineItems.slice(start, start + productRowsPerPage);
   }, [lineItems, productPage, productRowsPerPage]);

   const handleSave = async () => {
      if (!order || itemsWithQty.length === 0) return;
      await editOrder({
         orderId: order.orderId,
         orderName: orderName.trim() || order.orderName,
         clientId,
         products: itemsWithQty,
         incoterms,
         portOfLoading,
         portOfDischarge,
         transportMode,
         estimatedShipmentDate,
         status,
      });
      onClose();
   };

   const canSave =
      order &&
      orderName.trim().length > 0 &&
      clientId.length > 0 &&
      itemsWithQty.length > 0;

   if (!order) return null;

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
            <Stack
               direction="row"
               justifyContent="space-between"
               alignItems="center"
               sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  flexShrink: 0,
               }}
            >
               <Typography
                  variant="h6"
                  sx={{
                     fontSize: { xs: "1.2rem", md: "1.6rem" },
                     fontWeight: 600,
                  }}
               >
                  编辑订单
               </Typography>
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
               <Stack spacing={3} sx={{ px: 2, py: 3 }}>
                  <Stack spacing={2}>
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
                        size="small"
                        label="订单名称"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        required
                     />

                     <Select
                        fullWidth
                        title="客户"
                        size="small"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        displayEmpty
                        MenuProps={{ sx: { zIndex: 9999, borderRadius: 20 } }}
                     >
                        {clientList.map((c) => (
                           <MenuItem key={c.clientId} value={c.clientId}>
                              {c.companyName}
                           </MenuItem>
                        ))}
                     </Select>
                  </Stack>

                  <Stack spacing={2}>
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
                     <TextField
                        fullWidth
                        size="small"
                        label="装货港"
                        value={portOfLoading}
                        onChange={(e) => setPortOfLoading(e.target.value)}
                     />
                     <TextField
                        fullWidth
                        size="small"
                        label="卸货港"
                        value={portOfDischarge}
                        onChange={(e) => setPortOfDischarge(e.target.value)}
                     />
                     <Typography variant="subtitle2" color="text.secondary">
                        运输方式
                     </Typography>
                     <ToggleButtonGroup
                        value={transportMode}
                        exclusive
                        onChange={(_, val) => val && setTransportMode(val)}
                        size="small"
                        fullWidth
                     >
                        {TRANSPORT_MODES.map(({ value, label, icon }) => (
                           <ToggleButton key={value} value={value}>
                              {icon}
                              {label}
                           </ToggleButton>
                        ))}
                     </ToggleButtonGroup>
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
                           textField: { size: "small", fullWidth: true },
                           popper: { style: { zIndex: 9999 } },
                        }}
                     />
                     <TextField
                        select
                        fullWidth
                        size="small"
                        label="贸易术语"
                        value={incoterms}
                        onChange={(e) => setIncoterms(e.target.value)}
                        SelectProps={{ MenuProps: { sx: { zIndex: 9999 } } }}
                     >
                        <MenuItem value="">—</MenuItem>
                        {INCOTERMS.map((term) => (
                           <MenuItem key={term} value={term}>
                              {term}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Stack>

                  <Stack spacing={2}>
                     <Typography variant="subtitle2" color="text.secondary">
                        订单状态
                     </Typography>
                     <Select
                        fullWidth
                        size="small"
                        value={status}
                        onChange={(e) =>
                           setStatus(e.target.value as OrderStatus)
                        }
                     >
                        {STATUS_OPTIONS.map((opt) => (
                           <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </Stack>

                  <Stack spacing={1.5}>
                     <Typography
                        variant="h6"
                        className="form-header"
                        sx={{
                           fontSize: { xs: "1.2rem", md: "1.6rem" },
                           fontWeight: 500,
                        }}
                     >
                        产品与数量
                     </Typography>
                     <TableContainer sx={{ overflow: "auto" }}>
                        <Table size="small" stickyHeader>
                           <TableHead>
                              <TableRow>
                                 <TableCell align="right" sx={{ width: 56 }} />
                                 <TableCell>产品</TableCell>
                                 <TableCell align="right" sx={{ width: 120 }}>
                                    数量
                                 </TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {paginatedLineItems.map((item) => {
                                 const p = products?.[item.productId];
                                 return (
                                    <TableRow key={item.productId}>
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
                                                bgcolor: "action.hover",
                                                backgroundImage: p?.image
                                                   ? `url(${p.image})`
                                                   : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                ml: "auto",
                                             }}
                                          />
                                       </TableCell>
                                       <TableCell>
                                          <Typography
                                             variant="body2"
                                             fontWeight={500}
                                          >
                                             {p?.productChineseName ||
                                                item.productId}
                                          </Typography>
                                          <Typography
                                             variant="caption"
                                             color="text.secondary"
                                          >
                                             {p?.productEnglishName}
                                          </Typography>
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
                                                handleQuantityChange(
                                                   item.productId,
                                                   e.target.value,
                                                )
                                             }
                                             inputProps={{ min: 0 }}
                                             sx={{ maxWidth: 80 }}
                                          />
                                       </TableCell>
                                    </TableRow>
                                 );
                              })}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     <TablePagination
                        component="div"
                        count={lineItems.length}
                        rowsPerPage={productRowsPerPage}
                        page={productPage}
                        onPageChange={(_, newPage) => setProductPage(newPage)}
                        onRowsPerPageChange={(e) => {
                           setProductRowsPerPage(parseInt(e.target.value, 10));
                           setProductPage(0);
                        }}
                        rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS]}
                        labelRowsPerPage="每页显示:"
                     />
                  </Stack>
               </Stack>
            </Box>

            <Paper
               elevation={4}
               sx={{
                  position: "sticky",
                  bottom: 0,
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  flexShrink: 0,
               }}
            >
               <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={onClose}>取消</Button>
                  <Button
                     variant="contained"
                     onClick={handleSave}
                     disabled={!canSave || serviceLoading}
                  >
                     {serviceLoading ? "保存中…" : "保存"}
                  </Button>
               </Stack>
            </Paper>
         </Box>
      </Drawer>
   );
}
