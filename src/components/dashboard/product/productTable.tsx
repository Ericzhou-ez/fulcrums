import * as React from "react";
import {
   Box,
   Card,
   Divider,
   IconButton,
   InputAdornment,
   OutlinedInput,
   Select,
   MenuItem,
   Stack,
   Typography,
   Checkbox,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Button,
   Tooltip,
   TablePagination,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Alert,
   TextField,
   Menu,
} from "@mui/material";
import {
   Image as ImageIcon,
   MagnifyingGlass as MagnifyingGlassIcon,
   PencilSimple as PencilSimpleIcon,
   Trash as TrashIcon,
   ShareNetwork as ExportIcon,
} from "phosphor-react";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { Clients, Product, Supplier } from "../../../types/types";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { useUIStateContext } from "../../../contexts/UIStateContextProvider";
import { BuildInternalProductPDF } from "../../../lib/InteralProductsPDFBuilder";
import { ExternalPDFBuilder } from "../../../lib/externalPDFBuilder";
import HeartComponent from "./heart";
import Loader from "../../core/loader";
import { exportInternalProductCSV } from "../../../lib/InternalProductCSVBuilder";
import ExportDialog from "./exportProductModal";
import { exportExternalProductCSV } from "../../../lib/ClientProductCsvBuilder";

const symbolToCurrencyCode: Record<string, string> = {
   "¥": "CNY",
   $: "USD",
   "€": "EUR",
};

export function ProductTable({ productList }: { productList: Product[] }) {
   const { toggleSaveUnsaveProduct, deleteProducts, clients, suppliers } =
      useProductSupplierClientContext();

   async function toggleSave(productId: string) {
      await toggleSaveUnsaveProduct(productId);
   }

   const { navOpen } = useUIStateContext();
   const { isDark, isSmUp } = useThemeContext();
   const [searchTerm, setSearchTerm] = React.useState("");
   // const [category, setCategory] = React.useState("all");
   const [selectedClient, setSelectedClient] = React.useState("all");
   const [client, setClient] = React.useState<Clients[] | undefined>(undefined);

   const [supplier, setSupplier] = React.useState<Supplier[] | undefined>(
      undefined
   );
   const [selectedSupplier, setSelectedSupplier] = React.useState("all");

   const [sortOrder, setSortOrder] = React.useState("desc");
   const [products, setProducts] = React.useState<Product[]>([]);

   const [pdfLoading, setPdfLoading] = React.useState(false);
   const [pdfSuccess, setPdfSuccess] = React.useState(false);

   const [currency, setCurrency] = React.useState("$");
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

   const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
   const [exportMode, setExportMode] = React.useState<"csv" | "pdf" | "">("");

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const toggleCurrency = (currency: string) => {
      currency === "$" ? setCurrency("€") : setCurrency("$");
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   React.useEffect(() => {
      setProducts(productList);
   }, [productList]);

   React.useEffect(() => {
      setClient(Object.values(clients));
      setSupplier(Object.values(suppliers));
   }, [clients, suppliers]);

   const [selected, setSelected] = React.useState<Set<string>>(new Set());
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(20);

   const filteredProducts = React.useMemo(() => {
      let data = [...products];

      if (searchTerm) {
         const lowerSearch = searchTerm.toLowerCase();
         data = data.filter(
            (item) =>
               item.productEnglishName.toLowerCase().includes(lowerSearch) ||
               item.productChineseName.includes(searchTerm) ||
               item.hsCode.includes(searchTerm)
         );
      }

      
      // if (category !== "all") {
      //    data = data.filter((item) => item?.hsCode === category);
      // }

      if (selectedClient !== "all") {
         data = data.filter((p) => p.clients?.includes(selectedClient));
      }

      if (selectedSupplier !== "all") {
         data = data.filter((p) => p.supplierId === selectedSupplier);
      }

      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();

         return sortOrder === "desc"
            ? dateB - dateA // latest first
            : dateA - dateB; // oldest first
      });

      return data;
   }, [products, searchTerm, sortOrder, selectedClient, selectedSupplier]);

   const displayedProducts = React.useMemo(() => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
   }, [filteredProducts, page, rowsPerPage]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(0);
   };

   function exportInternalCSV(
      upChargeNum: number,
      exchangeRate: number,
      currency: string,
      pricePerContainer: number
   ) {
      exportInternalProductCSV({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, Product>),
         upCharge: upChargeNum,
         suppliers: suppliers,
         clients: clients,
         exchangeRate: exchangeRate,
         currency: currency,
         pricePerContainer: pricePerContainer,
      });

      setIsExportModalOpen(false);
   }

   function exportClientCsv(
      upChargeNum: number,
      exchangeRate: number,
      currency: string,
      pricePerContainer: number
   ) {
      exportExternalProductCSV({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, Product>),
         upCharge: upChargeNum,
         exchangeRate: exchangeRate,
         currency: currency,
         pricePerContainer: pricePerContainer,
      });

      setIsExportModalOpen(false);
   }

   // const handleCategoryChange = (e: any) => {
   //    setCategory(e.target.value);
   //    setPage(0);
   // };

   const handleSortChange = (e: any) => {
      setSortOrder(e.target.value);
      setPage(0);
   };

   const handleSelectAll = () => {
      const allIds = displayedProducts.map((p) => p.productId);
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

   const isAnySelected = selected.size > 0;

   const areAllSelected =
      displayedProducts.length > 0 &&
      displayedProducts.every((p) => selected.has(p.productId));
   const areSomeSelected = selected.size > 0 && !areAllSelected;

   const handleDeleteSelected = async () => {
      const idsToDelete = Array.from(selected);

      setProducts((prev) => prev.filter((p) => !selected.has(p.productId)));
      setSelected(new Set());

      await deleteProducts(idsToDelete);
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

   const selectedProductsList = React.useMemo(() => {
      return products.filter((p) => selected.has(p.productId));
   }, [products, selected]);

   const resetExportForm = () => {
      setIsExportModalOpen(false);
      setPdfSuccess(false);

      setCurrency("$");
   };

   const handleInternal = async (
      upChargeNum: number,
      conversionRateNum: number,
      currency: string,
      pricePerContainerNum: number
   ) => {
      if (
         upChargeNum < 1.01 ||
         upChargeNum >= 10 ||
         isNaN(upChargeNum) ||
         conversionRateNum <= 0 ||
         isNaN(conversionRateNum) ||
         pricePerContainerNum <= 0 ||
         isNaN(pricePerContainerNum)
      )
         return;

      setPdfLoading(true);

      await BuildInternalProductPDF({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, Product>),
         conversionRate: conversionRateNum,
         currency,
         upCharge: upChargeNum,
         pricePerContainer: pricePerContainerNum,
         suppliers,
         clients,
      });

      setPdfLoading(false);
      setPdfSuccess(true);
      setTimeout(resetExportForm, 2000);
   };

   const handleClient = async (
      upChargeNum: number,
      conversionRateNum: number,
      currency: string,
      pricePerContainerNum: number
   ) => {
      if (
         upChargeNum < 1.01 ||
         upChargeNum >= 10 ||
         isNaN(upChargeNum) ||
         conversionRateNum <= 0 ||
         isNaN(conversionRateNum) ||
         pricePerContainerNum <= 0 ||
         isNaN(pricePerContainerNum)
      )
         return;

      setPdfLoading(true);

      await ExternalPDFBuilder({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, Product>),
         upCharge: upChargeNum,
         conversionRate: conversionRateNum,
         currency,
         pricePerContainer: pricePerContainerNum,
      });

      setPdfLoading(false);
      setPdfSuccess(true);
      setTimeout(resetExportForm, 2000);
   };

   return (
      <Box
         sx={{
            bgcolor: "var(--mui-palette-background-level1)",
            mt: 5,
         }}
         borderRadius={5}
      >
         <Card
            sx={{
               px: 0,
               pt: 5,
               pb: 2,
               br: 5,
               boxShadow: isDark
                  ? "0 2px 8px rgba(255,255,255,0.12)"
                  : "0 3px 13px rgba(0,0,0,0.12)",
               borderRadius: "22px",
               bgcolor: isDark ? "#090a0b" : "#fffe",
            }}
         >
            <Stack
               direction={isSmUp ? "row" : "column"}
               spacing={2}
               sx={{
                  alignItems: "center",
                  flexWrap: "no-wrap",
                  px: { xs: 2, sm: 4 },
               }}
            >
               <OutlinedInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  placeholder="搜索产品"
                  startAdornment={
                     <InputAdornment position="start">
                        <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                     </InputAdornment>
                  }
                  sx={{ width: "100%" }}
               />

               <Stack
                  direction="row"
                  gap={1}
                  sx={{
                     alignItems: "center",
                     justifyContent: "space-between",
                     flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
               >
                  <Select
                     value={sortOrder}
                     onChange={handleSortChange}
                     size="small"
                     name="sort"
                  >
                     <MenuItem value="desc">最新</MenuItem>
                     <MenuItem value="asc">最早</MenuItem>
                  </Select>
                  <Select
                     size="small"
                     value={selectedClient} // "all" or a clientName
                     onChange={(e) => {
                        setSelectedClient(e.target.value); // clientId
                        setPage(0);
                     }}
                  >
                     <MenuItem value="all">全部客户</MenuItem>
                     {client?.map((c) => (
                        <MenuItem key={c.clientId} value={c.clientId}>
                           {c.companyName}
                        </MenuItem>
                     ))}
                  </Select>
                  <Select
                     size="small"
                     value={selectedSupplier} // "all" or a suplierName
                     onChange={(e) => {
                        setSelectedSupplier(e.target.value); // supplierId
                        setPage(0);
                     }}
                  >
                     <MenuItem value="all">全部供应商</MenuItem>
                     {supplier?.map((c) => (
                        <MenuItem key={c.supplierName} value={c.supplierId}>
                           {c.supplierName}
                        </MenuItem>
                     ))}
                  </Select>
                  {/* <Select
                     size="small"
                     value={category}
                     onChange={handleCategoryChange}
                     name="category"
                  >
                     <MenuItem value="all">所有类别</MenuItem>
                     {typeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </Select> */}
                  {isAnySelected && (
                     <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "space-between" }}
                     >
                        <IconButton onClick={handleDeleteSelected}>
                           <TrashIcon weight="bold" />
                        </IconButton>
                        <IconButton onClick={handleClick}>
                           <ExportIcon weight="bold" />
                        </IconButton>
                     </Stack>
                  )}
               </Stack>
            </Stack>
            <Divider sx={{ mt: 5 }} />

            <Box
               sx={{
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                     display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
               }}
            >
               <Table
                  sx={{
                     "& .MuiTableCell-root": {
                        px: 2,
                     },
                  }}
               >
                  <TableHead
                     sx={{
                        bgcolor: isDark ? "#242424" : "#f5f5f5",
                        fontWeight: 500,
                        fontSize: "1.2rem",
                     }}
                  >
                     <TableRow>
                        <TableCell
                           padding="checkbox"
                           sx={{
                              width: "40px",
                              minWidth: "40px",
                              maxWidth: "40px",
                           }}
                        >
                           <Checkbox
                              checked={areAllSelected}
                              indeterminate={areSomeSelected}
                              onChange={() => {
                                 if (areAllSelected) {
                                    handleDeselectAll();
                                 } else {
                                    handleSelectAll();
                                 }
                              }}
                           />
                        </TableCell>
                        <TableCell>产品</TableCell>
                        <TableCell>HS代码</TableCell>
                        <TableCell>供应商</TableCell>
                        <TableCell>数量</TableCell>
                        <TableCell>单价</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {displayedProducts.map((row) => {
                        const rowSelected = selected.has(row.productId);

                        const priceString = new Intl.NumberFormat("en-US", {
                           style: "currency",
                           currency:
                              symbolToCurrencyCode[row.currency] ?? "CNY",
                        }).format(parseFloat(row.unitPrice));

                        return (
                           <TableRow
                              key={row.productId}
                              selected={rowSelected}
                              hover
                           >
                              <TableCell padding="checkbox">
                                 <Checkbox
                                    checked={rowSelected}
                                    onChange={() =>
                                       handleToggleOne(row.productId)
                                    }
                                 />
                              </TableCell>
                              <TableCell>
                                 <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                 >
                                    {row.image ? (
                                       <Box
                                          sx={{
                                             width: 80,
                                             height: 80,
                                             borderRadius: 1,
                                             bgcolor:
                                                "var(--mui-palette-background-level2)",
                                             backgroundImage: `url(${row.image})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                             flexShrink: 0,
                                          }}
                                       />
                                    ) : (
                                       <Box
                                          sx={{
                                             width: 80,
                                             height: 80,
                                             borderRadius: 1,
                                             bgcolor:
                                                "var(--mui-palette-background-level2)",
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center",
                                             flexShrink: 0,
                                          }}
                                       >
                                          <ImageIcon fontSize="var(--icon-fontSize-lg)" />
                                       </Box>
                                    )}
                                    <Box
                                       sx={{
                                          maxWidth: "80%",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                       }}
                                    >
                                       <a href={`/product/${row.productId}`}>
                                          <Typography
                                             variant="subtitle1"
                                             fontSize={{
                                                xs: "0.9rem",
                                                md: "1.1rem",
                                             }}
                                             noWrap
                                             className="link"
                                          >
                                             {row.productChineseName}
                                          </Typography>
                                       </a>
                                       <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          fontWeight={500}
                                          noWrap
                                       >
                                          {row.productEnglishName}
                                       </Typography>
                                    </Box>
                                 </Stack>
                              </TableCell>
                              {/* Category */}
                              <TableCell>
                                 <Typography variant="inherit" noWrap>
                                    {row.hsCode || "---"}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography variant="inherit" noWrap>
                                    {suppliers[row.supplierId]?.supplierName}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography variant="inherit" noWrap>
                                    {row.packing}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                 >
                                    <Typography variant="inherit">
                                       {priceString}
                                    </Typography>
                                    <Stack direction="row">
                                       <a href={`/product/${row.productId}`}>
                                          <IconButton>
                                             <PencilSimpleIcon />
                                          </IconButton>
                                       </a>
                                       <div
                                          onClick={() =>
                                             toggleSave(row.productId)
                                          }
                                       >
                                          <Tooltip title="收藏">
                                             <HeartComponent
                                                saved={row.saved}
                                             />
                                          </Tooltip>
                                       </div>
                                    </Stack>
                                 </Stack>
                              </TableCell>
                           </TableRow>
                        );
                     })}

                     {displayedProducts.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={6}>
                              <Typography variant="body2" textAlign="center">
                                 没有找到相关产品
                              </Typography>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </Box>

            <TablePagination
               rowsPerPageOptions={[10, 20, 50]}
               component="div"
               count={filteredProducts.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
               labelRowsPerPage="每页显示:"
            />
         </Card>

         <ExportDialog
            open={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            pdfLoading={pdfLoading}
            currency={currency}
            toggleCurrency={toggleCurrency}
            onClientExport={handleClient}
            onInternalExport={handleInternal}
            exportType={exportMode}
            onInternalCsv={exportInternalCSV}
            onClientCsv={exportClientCsv}
         />

         {pdfSuccess && (
            <Box
               sx={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  zIndex: "9999",
                  width: navOpen ? "calc(100% - 240px)" : "100%",
               }}
            >
               <Alert severity="success">导出成功 :)</Alert>
            </Box>
         )}

         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
            PaperProps={{
               classes: {
                  root: "custom-menu",
               },
            }}
         >
            <MenuItem
               onClick={() => {
                  handleClose();
                  setIsExportModalOpen(true);
                  setExportMode("pdf");
               }}
            >
               导出为PDF
            </MenuItem>
            <MenuItem
               onClick={() => {
                  handleClose();
                  setIsExportModalOpen(true);
                  setExportMode("csv");
               }}
            >
               导出为EXCEL
            </MenuItem>
            <MenuItem onClick={handleClose}>分享为链接</MenuItem>
         </Menu>
      </Box>
   );
}
