import React, { useState, useEffect, useMemo } from "react";
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
   Button,
   Alert,
   IconButton,
   Drawer,
   TextField,
   InputAdornment,
   TablePagination,
} from "@mui/material";
import { Plus, X, MagnifyingGlass } from "phosphor-react";
import { useParams } from "react-router-dom";
import Nav from "../../core/nav";
import Footer from "../../core/footer";
import SideNav from "../dashboardNav";
import "../../../styles/quotation.css";
import { useUIStateContext } from "../../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { Product, Supplier } from "../../../types/types";
import { AssignedProductsTable } from "./clientProductTable";

// --- Drawer for Adding Products ---
interface ProductAssignmentDrawerProps {
   open: boolean;
   onClose: () => void;
   onSave: (productIdsToAdd: string[]) => void;
   allProducts: Product[];
   assignedProductIds: Set<string>;
   suppliers: { [key: string]: Supplier };
}

const ProductAssignmentDrawer: React.FC<ProductAssignmentDrawerProps> = ({
   open,
   onClose,
   onSave,
   allProducts,
   assignedProductIds,
   suppliers,
}) => {
   const [selected, setSelected] = useState<Set<string>>(new Set());
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [searchTerm, setSearchTerm] = useState("");

   // Reset state when drawer closes
   useEffect(() => {
      if (!open) {
         setSelected(new Set());
         setSearchTerm("");
         setPage(0);
      }
   }, [open]);

   const availableProducts = useMemo(
      () => allProducts.filter((p) => !assignedProductIds.has(p.productId)),
      [allProducts, assignedProductIds]
   );

   const filteredProducts = useMemo(() => {
      if (!searchTerm) return availableProducts;
      const lowercasedFilter = searchTerm.toLowerCase();
      return availableProducts.filter((product) => {
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
   }, [availableProducts, searchTerm, suppliers]);

   const paginatedProducts = useMemo(() => {
      const startIndex = page * rowsPerPage;
      return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
   }, [filteredProducts, page, rowsPerPage]);

   const areAllSelected =
      filteredProducts.length > 0 && selected.size === filteredProducts.length;
   const areSomeSelected =
      selected.size > 0 && selected.size < filteredProducts.length;

   const handleSelectAll = () =>
      setSelected(new Set(filteredProducts.map((p) => p.productId)));
   const handleDeselectAll = () => setSelected(new Set());

   const handleToggleOne = (productId: string) => {
      setSelected((prev) => {
         const newSet = new Set(prev);
         newSet.has(productId)
            ? newSet.delete(productId)
            : newSet.add(productId);
         return newSet;
      });
   };

   const handleSaveClick = () => {
      onSave(Array.from(selected));
      onClose();
   };

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         sx={{zIndex: 5999}}
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
               <Typography variant="h6" fontWeight={700}>
                  添加产品到客户
               </Typography>
               <IconButton onClick={onClose}>
                  <X />
               </IconButton>
            </Stack>

            <Box sx={{ p: 2 }}>
               <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="搜索可用产品..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <MagnifyingGlass />
                        </InputAdornment>
                     ),
                  }}
               />
            </Box>

            <TableContainer sx={{ flexGrow: 1 }}>
               <Table stickyHeader aria-label="add products table">
                  <TableHead>
                     <TableRow>
                        <TableCell padding="checkbox">
                           <Checkbox
                              checked={areAllSelected}
                              indeterminate={areSomeSelected}
                              onChange={
                                 areAllSelected
                                    ? handleDeselectAll
                                    : handleSelectAll
                              }
                           />
                        </TableCell>
                        <TableCell>产品</TableCell>
                        <TableCell>供应商</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {paginatedProducts.map((product) => (
                        <TableRow
                           key={product.productId}
                           hover
                           onClick={() => handleToggleOne(product.productId)}
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
                                       width: 40,
                                       height: 40,
                                       borderRadius: 1,
                                       bgcolor: "background.level2",
                                       backgroundImage: `url(${product.image})`,
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
                           <TableCell>
                              {suppliers[product.supplierId]?.supplierName ||
                                 "N/A"}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>

            <TablePagination
               rowsPerPageOptions={[5, 10, 20]}
               component="div"
               count={filteredProducts.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={(e, newPage) => setPage(newPage)}
               onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
               }}
               labelRowsPerPage="每页:"
               sx={{ mb: "40px" }}
            />

            <Paper
               elevation={4}
               sx={{
                  position: "sticky",
                  bottom: 0,
                  p: 2,
                  borderColor: "divider",
               }}
            >
               <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
               >
                  <Typography variant="subtitle1" fontWeight={600}>
                     已选择: {selected.size}
                  </Typography>
                  <Button
                     variant="contained"
                     onClick={handleSaveClick}
                     disabled={selected.size === 0}
                  >
                     确认添加
                  </Button>
               </Stack>
            </Paper>
         </Box>
      </Drawer>
   );
};

// --- Main Page Component ---
const ClientDetailsPage = () => {
   const { clientId } = useParams<{ clientId: string }>();
   const {
      clients,
      products,
      suppliers,
      addClientProducts,
      deleteClientProducts,
      serviceLoading,
   } = useProductSupplierClientContext();
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();

   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   useEffect(() => {
      document.title = "Fulcrums | 客户产品管理";
   }, []);

   const client = useMemo(() => {
      if (!clientId || !clients) return null;
      return clients[clientId];
   }, [clients, clientId]);

   const assignedProducts = useMemo(() => {
      if (!client || !client.productIds || !products) return [];
      return Object.values(products).filter((p) =>
         client.productIds.includes(p.productId)
      );
   }, [products, client]);

   const assignedProductIds = useMemo(
      () => new Set<string>(client?.productIds || []),
      [client]
   );

   const allProductsArray = useMemo(() => Object.values(products), [products]);

   const handleUnassignProducts = async (productIdsToRemove: string[]) => {
      if (!clientId) return;

      await deleteClientProducts(productIdsToRemove, clientId);
   };

   const handleConfirmAddProducts = async (productIdsToAdd: string[]) => {
      if (!clientId) return;

      await addClientProducts(productIdsToAdd, clientId);
   };

   if (!client) {
      return (
         <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
            <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
            <Nav home={false} searchBar={true} />
            <Box sx={{ textAlign: "center", mt: 5 }}>
               <Alert severity="error">
                  未找到客户。请检查链接或返回客户列表。
               </Alert>
            </Box>
            <Footer />
         </Box>
      );
   }

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
         <Nav home={false} searchBar={true} />

         <Box>
            <Stack
               direction="row"
               justifyContent="space-between"
               alignItems="center"
               spacing={2}
               mb={2}
            >
               <div className="title-recent">
                  <Typography
                     component="h1"
                     className="title-text-recent"
                     sx={{
                        fontSize: {
                           xs: "1.8rem",
                           sm: "2rem",
                           md: "2.2rem",
                           lg: "2.5rem",
                        },
                        fontWeight: 800,
                     }}
                  >
                     {client.companyName}
                  </Typography>
               </div>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus />}
                  onClick={() => setIsDrawerOpen(true)}
               >
                  添加
               </Button>
            </Stack>

            <div className="gradient-divider"></div>

            <Alert severity="info" sx={{ mt: 2, borderRadius: "12px" }}>
               注意：从此页面中“删除”产品仅会解除该产品与当前客户的关联，并不会从您的产品库中永久删除该产品。
            </Alert>

            <AssignedProductsTable
               products={assignedProducts}
               suppliers={suppliers}
               onUnassign={handleUnassignProducts}
               isLoading={serviceLoading}
            />
         </Box>

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

         <ProductAssignmentDrawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onSave={handleConfirmAddProducts}
            allProducts={allProductsArray}
            assignedProductIds={assignedProductIds}
            suppliers={suppliers}
         />

         <Footer />
      </Box>
   );
};

export default ClientDetailsPage;
