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
   Checkbox,
   Stack,
   IconButton,
   Tooltip,
   TablePagination,
   TextField,
   InputAdornment,
   Zoom,
} from "@mui/material";
import { Trash, MagnifyingGlass, CheckCircle } from "phosphor-react";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { Product, Supplier } from "../../../types/types";

interface AssignedProductsTableProps {
   products: Product[];
   suppliers: { [key: string]: Supplier };
   onUnassign: (productIds: string[]) => void;
}

export const AssignedProductsTable: React.FC<AssignedProductsTableProps> = ({
   products,
   suppliers,
   onUnassign,
}) => {
   const { isDark, isSmUp } = useThemeContext();
   const [selected, setSelected] = useState<Set<string>>(new Set());
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [searchTerm, setSearchTerm] = useState("");

   const filteredProducts = useMemo(() => {
      if (!searchTerm) return products;

      const lowercasedFilter = searchTerm.toLowerCase();
      return products.filter((product) => {
         const supplierName =
            suppliers[product.supplierId]?.supplierName?.toLowerCase() || "";
         return (
            product.productChineseName
               .toLowerCase()
               .includes(lowercasedFilter) ||
            product.productEnglishName
               .toLowerCase()
               .includes(lowercasedFilter) ||
            supplierName.includes(lowercasedFilter)
         );
      });
   }, [products, searchTerm, suppliers]);

   const paginatedProducts = useMemo(() => {
      const startIndex = page * rowsPerPage;
      return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
   }, [filteredProducts, page, rowsPerPage]);

   const isAnySelected = selected.size > 0;

   const areAllSelected =
      filteredProducts.length > 0 && selected.size === filteredProducts.length;

   const areSomeSelected =
      selected.size > 0 && selected.size < filteredProducts.length;

   const handleSelectAll = () => {
      const allIds = filteredProducts.map((p) => p.productId);
      setSelected(new Set(allIds));
   };

   const handleDeselectAll = () => {
      setSelected(new Set());
   };

   const handleToggleOne = (productId: string) => {
      setSelected((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(productId)) {
            newSet.delete(productId);
         } else {
            newSet.add(productId);
         }
         return newSet;
      });
   };

   const handleUnassignClick = () => {
      onUnassign(Array.from(selected));
      setSelected(new Set());
   };

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(0);
   };

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0";

   return (
      <Paper
         sx={{
            borderRadius: "15px",
            border: `1px solid ${borderColor}`,
            boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)",
            overflow: "hidden",
            backgroundColor: "background.paper",
            mt: 3,
         }}
      >
         <Stack
            direction={isSmUp ? "row" : "column"}
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            sx={{ p: 2 }}
         >
            <TextField
               variant="outlined"
               size="small"
               placeholder="搜索产品或供应商"
               value={searchTerm}
               onChange={handleSearchChange}
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start">
                        <MagnifyingGlass />
                     </InputAdornment>
                  ),
               }}
               sx={{ width: "100%" }}
            />
            {isAnySelected && (
               <Tooltip title="从该客户移除所选产品">
                  <IconButton onClick={handleUnassignClick}>
                     <Trash />
                  </IconButton>
               </Tooltip>
            )}
         </Stack>

         <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="assigned products table">
               <TableHead
                  sx={{
                     backgroundColor: isDark ? "#191919" : "#f9fafb",
                  }}
               >
                  <TableRow>
                     <TableCell padding="checkbox">
                        <Checkbox
                           checked={areAllSelected}
                           indeterminate={areSomeSelected}
                           onChange={() => {
                              areAllSelected
                                 ? handleDeselectAll()
                                 : handleSelectAll();
                           }}
                        />
                     </TableCell>
                     <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                     >
                        产品
                     </TableCell>
                     <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                     >
                        供应商
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedProducts.map((product) => {
                     const supplierName =
                        suppliers[product.supplierId]?.supplierName ||
                        "未知供应商";

                     return (
                        <TableRow
                           key={product.productId}
                           hover
                           onClick={() => handleToggleOne(product.productId)}
                           role="checkbox"
                           aria-checked={selected.has(product.productId)}
                           selected={selected.has(product.productId)}
                           sx={{ cursor: "pointer" }}
                        >
                           <TableCell padding="checkbox">
                              <Checkbox
                                 checked={selected.has(product.productId)}
                              />
                           </TableCell>
                           <TableCell>
                              <Stack
                                 direction="row"
                                 spacing={2}
                                 alignItems="center"
                              >
                                 <Box
                                    sx={{
                                       width: 60,
                                       height: 60,
                                       borderRadius: 1,
                                       bgcolor: "background.level2",
                                       backgroundImage: `url(${product.image})`,
                                       backgroundSize: "cover",
                                       backgroundPosition: "center",
                                       flexShrink: 0,
                                    }}
                                 />

                                 <Box>
                                    <a
                                       style={{ all: "unset" }}
                                       href={`/product/${product.productId}`}
                                    >
                                       <Typography
                                          variant="subtitle2"
                                          color="text.primary"
                                       >
                                          {product.productChineseName}
                                       </Typography>
                                       <Typography
                                          variant="body2"
                                          color="text.secondary"
                                       >
                                          {product.productEnglishName}
                                       </Typography>
                                    </a>
                                 </Box>
                              </Stack>
                           </TableCell>
                           <TableCell sx={{ color: "text.secondary" }}>
                              {supplierName}
                           </TableCell>
                        </TableRow>
                     );
                  })}
                  {filteredProducts.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={3} align="center">
                           <Typography sx={{ py: 3 }} color="text.secondary">
                              没有找到相关产品。
                           </Typography>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每页显示:"
            labelDisplayedRows={({ from, to, count }) =>
               `${from}-${to} / ${count}`
            }
         />

         <Zoom in={products.length > 0}>
            <Box
               sx={{
                  position: "fixed",
                  bottom: { xs: 24, md: 32 },
                  right: { xs: 24, md: 32 },
                  zIndex: 1300,
                  backgroundColor: isDark
                     ? "rgba(40, 40, 40, 0.6)"
                     : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(6px)",
                  border: `1px solid ${
                     isDark
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.8)"
                  }`,
                  borderRadius: "50px",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                  py: 1,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
               }}
            >
               {selected.size > 0 ? (
                  <Stack direction="row" gap={1} alignItems="center">
                     <CheckCircle
                        color={isDark ? "#66bb6a" : "#2e7d32"}
                        weight="fill"
                        size={20}
                     />
                     <Typography variant="body1" fontWeight={500}>
                        已选择 {selected.size} 项
                     </Typography>
                  </Stack>
               ) : (
                  <Typography variant="body1" fontWeight={500}>
                     共 {products.length} 项
                  </Typography>
               )}
            </Box>
         </Zoom>
      </Paper>
   );
};
