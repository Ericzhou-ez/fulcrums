import React, { useState, useMemo } from "react";
import {
   Typography,
   Box,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Tooltip,
   IconButton,
   Stack,
   TextField,
   InputAdornment,
   Select,
   MenuItem,
   TablePagination,
   Skeleton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Button,
} from "@mui/material";
import { Trash, PencilSimple, MagnifyingGlass } from "phosphor-react";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { Order, OrderStatus, Clients } from "../../../types/types";
import TimeAgoTypography from "../product/timeAgoTypography";

const ROWS_PER_PAGE_OPTIONS = [5, 20, 50] as const;
const DEFAULT_ROWS_PER_PAGE = 20;

export interface OrderTableProps {
   onEdit?: (order: Order) => void;
   onDelete?: (order: Order) => void;
}

export function OrderTable({ onEdit, onDelete }: OrderTableProps) {
   const { orders, clients, updateOrderState, serviceLoading } =
      useProductSupplierClientContext();
   const { isDark } = useThemeContext();

   const [searchTerm, setSearchTerm] = useState("");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
   const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

   const ordersArray = useMemo(
      () => (orders ? Object.values(orders) : []),
      [orders],
   );

   const getClientName = (clientId: string) => {
      const c = clients?.[clientId] as Clients | undefined;
      return c?.companyName ?? clientId;
   };

   const filteredOrders = useMemo(() => {
      let data = [...ordersArray];
      if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         data = data.filter(
            (o) =>
               o.orderId.toLowerCase().includes(lower) ||
               (o.orderName || "").toLowerCase().includes(lower) ||
               getClientName(o.clientId).toLowerCase().includes(lower),
         );
      }
      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();
         return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
      return data;
   }, [ordersArray, searchTerm, sortOrder, clients]);

   const displayedOrders = useMemo(() => {
      const start = page * rowsPerPage;
      return filteredOrders.slice(start, start + rowsPerPage);
   }, [filteredOrders, page, rowsPerPage]);

   const borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0";
   const cellBorderSx = {
      borderBottom: `1px solid ${borderColor}`,
      color: "text.secondary",
   };
   const headSx = {
      fontWeight: 600,
      color: "text.secondary",
      borderBottom: `1px solid ${borderColor}`,
      textWrap: "nowrap" as const,
   };

   const statusLabel: Record<OrderStatus, string> = {
      draft: "草稿",
      shipped: "已发货",
      customs_clearance: "清关中",
      delivered: "已送达",
      cancelled: "已取消",
   };

   return (
      <Stack>
         <Stack direction="row" spacing={1} alignItems="center" sx={{ pb: 2 }}>
            <TextField
               fullWidth
               variant="outlined"
               size="small"
               placeholder="搜索订单 ID、名称或客户"
               value={searchTerm}
               onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
               }}
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <MagnifyingGlass />
                     </InputAdornment>
                  ),
               }}
            />
            <Select
               value={sortOrder}
               onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc");
                  setPage(0);
               }}
               size="small"
            >
               <MenuItem value="desc">最新</MenuItem>
               <MenuItem value="asc">最早</MenuItem>
            </Select>
         </Stack>

         <Paper
            sx={{
               borderRadius: "15px",
               border: `1px solid ${borderColor}`,
               boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)",
               overflow: "hidden",
               backgroundColor: "background.paper",
            }}
         >
            <TableContainer>
               <Table sx={{ minWidth: 700 }} aria-label="orders table">
                  <TableHead
                     sx={{ backgroundColor: isDark ? "#191919" : "#f9fafb" }}
                  >
                     <TableRow>
                        <TableCell sx={headSx}>订单名称</TableCell>
                        <TableCell sx={headSx}>客户</TableCell>
                        <TableCell sx={headSx}>状态</TableCell>
                        <TableCell sx={headSx}>上次更新</TableCell>
                        <TableCell
                           align="right"
                           sx={{
                              ...headSx,
                              borderBottom: `1px solid ${borderColor}`,
                           }}
                        />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {serviceLoading && ordersArray.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                           <TableRow key={`skeleton-${i}`}>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={100} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={140} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={80} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={80} />
                              </TableCell>
                              <TableCell sx={cellBorderSx} align="right">
                                 <Skeleton
                                    variant="rounded"
                                    width={32}
                                    height={32}
                                    sx={{ display: "inline-block" }}
                                 />
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <>
                           {displayedOrders.map((order) => (
                              <TableRow
                                 key={order.orderId}
                                 sx={{
                                    "&:last-child td, &:last-child th": {
                                       border: 0,
                                    },
                                    "&:hover": {
                                       backgroundColor: isDark
                                          ? "rgba(255, 255, 255, 0.08)"
                                          : "#f5f5f5",
                                    },
                                 }}
                              >
                                 <TableCell
                                    component="th"
                                    scope="row"
                                    sx={cellBorderSx}
                                 >
                                    <Typography
                                       variant="body2"
                                       sx={{
                                          fontWeight: 500,
                                          color: "text.primary",
                                       }}
                                    >
                                       {order.orderName ||
                                          order.orderId.slice(0, 8)}
                                    </Typography>
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    {getClientName(order.clientId)}
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    <Select
                                       size="small"
                                       value={order.status}
                                       onChange={(e) =>
                                          updateOrderState(
                                             order.orderId,
                                             e.target.value as OrderStatus,
                                          )
                                       }
                                       sx={{ minWidth: 110 }}
                                    >
                                       <MenuItem value="draft">
                                          {statusLabel.draft}
                                       </MenuItem>
                                       <MenuItem value="shipped">
                                          {statusLabel.shipped}
                                       </MenuItem>
                                       <MenuItem value="customs_clearance">
                                          {statusLabel.customs_clearance}
                                       </MenuItem>
                                       <MenuItem value="delivered">
                                          {statusLabel.delivered}
                                       </MenuItem>
                                       <MenuItem value="cancelled">
                                          {statusLabel.cancelled}
                                       </MenuItem>
                                    </Select>
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    <TimeAgoTypography
                                       timestamp={order.updatedAt}
                                    />
                                 </TableCell>
                                 <TableCell align="right" sx={cellBorderSx}>
                                    {onDelete && (
                                       <Tooltip title="删除">
                                          <IconButton
                                             onClick={() =>
                                                setOrderToDelete(order)
                                             }
                                          >
                                             <Trash />
                                          </IconButton>
                                       </Tooltip>
                                    )}
                                    {onEdit && (
                                       <Tooltip title="编辑">
                                          <IconButton
                                             onClick={() => onEdit(order)}
                                          >
                                             <PencilSimple />
                                          </IconButton>
                                       </Tooltip>
                                    )}
                                 </TableCell>
                              </TableRow>
                           ))}
                           {filteredOrders.length === 0 && (
                              <TableRow>
                                 <TableCell colSpan={5} sx={cellBorderSx}>
                                    <Typography
                                       sx={{ py: 3 }}
                                       color="text.secondary"
                                    >
                                       暂无订单。点击「添加」创建订单。
                                    </Typography>
                                 </TableCell>
                              </TableRow>
                           )}
                        </>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>

            <TablePagination
               rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS]}
               component="div"
               count={filteredOrders.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={(_, newPage) => setPage(newPage)}
               onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
               }}
               labelRowsPerPage="每页显示:"
               labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} / ${count}`
               }
            />
         </Paper>

         <Dialog
            open={!!orderToDelete}
            onClose={() => setOrderToDelete(null)}
            aria-labelledby="delete-order-dialog-title"
            aria-describedby="delete-order-dialog-description"
         >
            <DialogTitle id="delete-order-dialog-title">
               删除订单
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="delete-order-dialog-description">
                  {orderToDelete ? (
                     <>
                        确定要删除订单「
                        {orderToDelete.orderName ||
                           orderToDelete.orderId.slice(0, 8)}
                        」吗？此操作无法撤销。
                     </>
                  ) : null}
               </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 2, pb: 2 }}>
               <Button onClick={() => setOrderToDelete(null)} autoFocus>
                  取消
               </Button>
               <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                     if (orderToDelete) {
                        onDelete?.(orderToDelete);
                        setOrderToDelete(null);
                     }
                  }}
               >
                  删除
               </Button>
            </DialogActions>
         </Dialog>
      </Stack>
   );
}
