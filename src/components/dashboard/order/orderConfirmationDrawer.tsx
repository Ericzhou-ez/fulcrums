import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { X, CaretLeft } from "phosphor-react";
import { Product, OrderProductLineItem } from "../../../types/types";

export type OrderLineItem = OrderProductLineItem;

interface OrderConfirmationDrawerProps {
   open: boolean;
   onClose: () => void;
   onBack: () => void;
   clientId: string;
   clientName: string;
   initialLineItems: OrderLineItem[];
   products: Record<string, Product>;
   onConfirm: (lineItems: OrderLineItem[]) => void;
   isSubmitting?: boolean;
}

const OrderConfirmationDrawer: React.FC<OrderConfirmationDrawerProps> = ({
   open,
   onClose,
   onBack,
   clientId,
   clientName,
   initialLineItems,
   products,
   onConfirm,
   isSubmitting = false,
}) => {
   const [lineItems, setLineItems] = useState<OrderLineItem[]>([]);

   useEffect(() => {
      if (open && initialLineItems.length > 0) {
         setLineItems(initialLineItems.map((item) => ({ ...item })));
      }
   }, [open, initialLineItems]);

   const handleQuantityChange = (productId: string, value: string) => {
      const num = value === "" ? 0 : parseInt(value, 10);
      if (isNaN(num) || num < 0) return;
      setLineItems((prev) =>
         prev.map((item) =>
            item.productId === productId
               ? { ...item, quantity: value === "" ? 0 : num }
               : item
         )
      );
   };

   const handleRemove = (productId: string) => {
      setLineItems((prev) => prev.filter((item) => item.productId !== productId));
   };

   const itemsWithQuantity = lineItems.filter((item) => item.quantity > 0);

   const handleConfirm = () => {
      if (itemsWithQuantity.length === 0) return;
      onConfirm(itemsWithQuantity);
   };

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         sx={{ zIndex: 6000 }}
         BackdropProps={{
            sx: {
               bgcolor: "rgba(18, 18, 18, 0.1)",
               backdropFilter: "blur(3px)",
            },
         }}
      >
         <Box
            sx={{
               width: { xs: "100vw", sm: 500, md: 600 },
               display: "flex",
               flexDirection: "column",
               height: "100%",
            }}
         >
            <Stack
               direction="row"
               justifyContent="space-between"
               alignItems="center"
               sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
            >
               <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={onBack} aria-label="返回">
                     <CaretLeft />
                  </IconButton>
                  <Typography variant="h6" fontWeight={700}>
                     确认订单
                  </Typography>
               </Stack>
               <IconButton onClick={onClose} aria-label="关闭">
                  <X />
               </IconButton>
            </Stack>

            <Box sx={{ px: 2, py: 1 }}>
               <Typography variant="body2" color="text.secondary">
                  客户
               </Typography>
               <Typography variant="subtitle1" fontWeight={600}>
                  {clientName || clientId}
               </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ px: 2, pb: 1 }} color="text.secondary">
               请确认产品与数量，可直接在下方修改
            </Typography>

            <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
               <Table stickyHeader size="small" aria-label="confirm order table">
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
                     {lineItems.map((item) => {
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
                                          color="text.primary"
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
                              <TableCell align="right" sx={{ width: 120 }}>
                                 <TextField
                                    type="number"
                                    size="small"
                                    value={
                                       item.quantity === 0 ? "" : item.quantity
                                    }
                                    onChange={(e) =>
                                       handleQuantityChange(
                                          item.productId,
                                          e.target.value
                                       )
                                    }
                                    inputProps={{
                                       min: 0,
                                       "aria-label": `数量 ${product.productChineseName}`,
                                    }}
                                    sx={{ maxWidth: 80 }}
                                 />
                              </TableCell>
                              <TableCell padding="none">
                                 <IconButton
                                    size="small"
                                    onClick={() => handleRemove(item.productId)}
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
                     <Button variant="outlined" onClick={onBack} disabled={isSubmitting}>
                        返回
                     </Button>
                     <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={
                           itemsWithQuantity.length === 0 || isSubmitting
                        }
                     >
                        {isSubmitting ? "提交中…" : "确认订单"}
                     </Button>
                  </Stack>
               </Stack>
            </Paper>
         </Box>
      </Drawer>
   );
};

export default OrderConfirmationDrawer;
