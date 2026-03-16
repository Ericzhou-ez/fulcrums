import * as React from "react";
import type { SelectChangeEvent } from "@mui/material";
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
   Tooltip,
   TablePagination,
   Alert,
   Menu,
   Zoom,
   Skeleton,
} from "@mui/material";
import {
   Image as ImageIcon,
   MagnifyingGlass as MagnifyingGlassIcon,
   PencilSimple as PencilSimpleIcon,
   Trash as TrashIcon,
   ShareNetwork as ExportIcon,
   CheckCircle,
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
import TimeAgoTypography from "./timeAgoTypography";

const symbolToCurrencyCode: Record<string, string> = {
   "¥": "CNY",
   $: "USD",
   "€": "EUR",
};

const ROWS_PER_PAGE_OPTIONS = [5, 20, 50] as const;
const DEFAULT_ROWS_PER_PAGE = 20;
const ROWS_PER_PAGE_STORAGE_KEY = "productTable.rowsPerPage";

function getStoredRowsPerPage(): number {
   if (typeof window === "undefined") return DEFAULT_ROWS_PER_PAGE;
   const stored = localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY);
   if (stored == null) return DEFAULT_ROWS_PER_PAGE;
   const n = parseInt(stored, 10);
   return ROWS_PER_PAGE_OPTIONS.includes(n as (typeof ROWS_PER_PAGE_OPTIONS)[number])
      ? n
      : DEFAULT_ROWS_PER_PAGE;
}

function productsToRecord(products: Product[]): Record<string, Product> {
   return products.reduce((acc, product) => {
      acc[product.productId] = product;
      return acc;
   }, {} as Record<string, Product>);
}

function isValidExportParams(
   upCharge: number,
   conversionRate: number,
   pricePerContainer: number
): boolean {
   return (
      upCharge >= 1.01 &&
      upCharge < 10 &&
      !isNaN(upCharge) &&
      conversionRate > 0 &&
      !isNaN(conversionRate) &&
      pricePerContainer > 0 &&
      !isNaN(pricePerContainer)
   );
}

type ProductTableRowProps = {
   row: Product;
   suppliers: Record<string, Supplier>;
   isSelected: boolean;
   onToggleSelect: () => void;
   onToggleSave: (productId: string) => void;
};

function ProductTableRow({
   row,
   suppliers,
   isSelected,
   onToggleSelect,
   onToggleSave,
}: ProductTableRowProps) {
   const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: symbolToCurrencyCode[row.currency] ?? "CNY",
   }).format(parseFloat(row.unitPrice));

   return (
      <TableRow key={row.productId} selected={isSelected} hover>
         <TableCell padding="checkbox">
            <Checkbox checked={isSelected} onChange={onToggleSelect} />
         </TableCell>
         <TableCell>
            <Stack direction="row" spacing={2} alignItems="center">
               {row.image ? (
                  <Box
                     sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        bgcolor: "var(--mui-palette-background-level2)",
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
                        bgcolor: "var(--mui-palette-background-level2)",
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
                        fontSize={{ xs: "0.9rem", md: "1.1rem" }}
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
         <TableCell>
            <Typography variant="inherit">
               {suppliers[row.supplierId]?.supplierName}
            </Typography>
         </TableCell>
         <TableCell>
            <Typography variant="inherit" noWrap>
               {row.packing}
            </Typography>
         </TableCell>
         <TableCell>
            <Typography variant="inherit">{priceString}</Typography>
         </TableCell>
         <TableCell>
            <TimeAgoTypography timestamp={row.updatedAt} />
         </TableCell>
         <TableCell>
            <Stack
               direction="row"
               justifyContent="space-between"
               alignItems="center"
            >
               <Stack direction="row">
                  <a href={`/product/${row.productId}`}>
                     <IconButton>
                        <PencilSimpleIcon />
                     </IconButton>
                  </a>
                  <div onClick={() => onToggleSave(row.productId)}>
                     <Tooltip title="收藏">
                        <HeartComponent saved={row.saved} />
                     </Tooltip>
                  </div>
               </Stack>
            </Stack>
         </TableCell>
      </TableRow>
   );
}

const tableScrollContainerSx = {
   overflowX: "auto" as const,
   "&::-webkit-scrollbar": { display: "none" },
   scrollbarWidth: "none" as const,
   msOverflowStyle: "none" as const,
};

type ProductTableProps = {
   productList?: Product[];
   savedOnly?: boolean;
};

export function ProductTable({
   productList,
   savedOnly = false,
}: ProductTableProps) {
   const {
      toggleSaveUnsaveProduct,
      deleteProducts,
      clients,
      suppliers,
      getProductsPage,
      getFilteredProducts,
      serviceLoading,
   } = useProductSupplierClientContext();
   const { navOpen } = useUIStateContext();
   const { isDark, isSmUp } = useThemeContext();

   const isContextMode = productList === undefined;

   const toggleSave = React.useCallback(
      (productId: string) => toggleSaveUnsaveProduct(productId),
      [toggleSaveUnsaveProduct]
   );

   // Filter & sort state
   const [searchTerm, setSearchTerm] = React.useState("");
   const [selectedClient, setSelectedClient] = React.useState("all");
   const [selectedSupplier, setSelectedSupplier] = React.useState("all");
   const [sortOrder, setSortOrder] = React.useState("desc");
   const [products, setProducts] = React.useState<Product[]>([]);
   const [client, setClient] = React.useState<Clients[] | undefined>(undefined);
   const [supplier, setSupplier] = React.useState<Supplier[] | undefined>(
      undefined
   );

   // Selection & pagination (rowsPerPage persisted to localStorage)
   const [selected, setSelected] = React.useState<Set<string>>(new Set());
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(getStoredRowsPerPage);

   const isTableLoading = isContextMode && serviceLoading;

   // Export & menu UI
   const [pdfLoading, setPdfLoading] = React.useState(false);
   const [pdfSuccess, setPdfSuccess] = React.useState(false);
   const [currency, setCurrency] = React.useState("$");
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
   const [exportMode, setExportMode] = React.useState<"csv" | "pdf" | "">("");

   const openExportMenu = (event: React.MouseEvent<HTMLElement>) =>
      setAnchorEl(event.currentTarget);
   const closeExportMenu = () => setAnchorEl(null);
   const toggleCurrency = (next: string) =>
      setCurrency(next === "$" ? "€" : "$");

   React.useEffect(() => {
      if (!isContextMode && productList) setProducts(productList);
   }, [isContextMode, productList]);
   React.useEffect(() => {
      setClient(Object.values(clients));
      setSupplier(Object.values(suppliers));
   }, [clients, suppliers]);

   const filters = React.useMemo(
      () => ({
         searchTerm,
         selectedClient,
         selectedSupplier,
         sortOrder: sortOrder as "asc" | "desc",
         savedOnly,
      }),
      [searchTerm, selectedClient, selectedSupplier, sortOrder, savedOnly]
   );

   const pageResult = React.useMemo(
      () =>
         isContextMode
            ? getProductsPage(page, rowsPerPage, filters)
            : { items: [] as Product[], total: 0 },
      [isContextMode, getProductsPage, page, rowsPerPage, filters]
   );

   const filteredProducts = React.useMemo(() => {
      if (isContextMode) return getFilteredProducts(filters);
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
      if (selectedClient !== "all") {
         data = data.filter((p) => p.clients?.includes(selectedClient));
      }
      if (selectedSupplier !== "all") {
         data = data.filter((p) => p.supplierId === selectedSupplier);
      }
      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();
         return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
      return data;
   }, [
      isContextMode,
      getFilteredProducts,
      filters,
      products,
      searchTerm,
      selectedClient,
      selectedSupplier,
      sortOrder,
   ]);

   const displayedProducts = React.useMemo(() => {
      if (isContextMode) return pageResult.items;
      const startIndex = page * rowsPerPage;
      return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
   }, [isContextMode, pageResult.items, filteredProducts, page, rowsPerPage]);

   const totalCount = isContextMode
      ? pageResult.total
      : filteredProducts.length;

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
         products: selectedProductsRecord,
         upCharge: upChargeNum,
         suppliers,
         clients,
         exchangeRate,
         currency,
         pricePerContainer,
      });
      setIsExportModalOpen(false);
      setSelected(new Set());
   }

   function exportClientCsv(
      upChargeNum: number,
      exchangeRate: number,
      currency: string,
      pricePerContainer: number
   ) {
      exportExternalProductCSV({
         products: selectedProductsRecord,
         upCharge: upChargeNum,
         exchangeRate,
         currency,
         pricePerContainer,
      });
      setIsExportModalOpen(false);
      setSelected(new Set());
   }

   const handleSortChange = (e: SelectChangeEvent<string>) => {
      setSortOrder(e.target.value);
      setPage(0);
   };

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

   const isAnySelected = selected.size > 0;

   const areAllSelected =
      displayedProducts.length > 0 &&
      displayedProducts.every((p) => selected.has(p.productId));
   const areSomeSelected = selected.size > 0 && !areAllSelected;

   const handleDeleteSelected = async () => {
      const idsToDelete = Array.from(selected);
      if (!isContextMode) {
         setProducts((prev) => prev.filter((p) => !selected.has(p.productId)));
      }
      setSelected(new Set());
      await deleteProducts(idsToDelete);
   };

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };
   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = parseInt(event.target.value, 10);
      setRowsPerPage(value);
      setPage(0);
      try {
         localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, String(value));
      } catch {
         // ignore quota or disabled storage
      }
   };

   const selectedProductsList = React.useMemo(() => {
      return filteredProducts.filter((p) => selected.has(p.productId)).reverse();
   }, [filteredProducts, selected]);

   const selectedProductsRecord = React.useMemo(
      () => productsToRecord(selectedProductsList),
      [selectedProductsList]
   );

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
      if (!isValidExportParams(upChargeNum, conversionRateNum, pricePerContainerNum))
         return;

      setPdfLoading(true);
      await BuildInternalProductPDF({
         products: selectedProductsRecord,
         conversionRate: conversionRateNum,
         currency,
         upCharge: upChargeNum,
         pricePerContainer: pricePerContainerNum,
         suppliers,
         clients,
      });

      setPdfLoading(false);
      setPdfSuccess(true);
      setSelected(new Set());
      setTimeout(resetExportForm, 2000);
   };

   const handleClient = async (
      upChargeNum: number,
      conversionRateNum: number,
      currency: string,
      pricePerContainerNum: number
   ) => {
      if (!isValidExportParams(upChargeNum, conversionRateNum, pricePerContainerNum))
         return;

      setPdfLoading(true);
      await ExternalPDFBuilder({
         products: selectedProductsRecord,
         upCharge: upChargeNum,
         conversionRate: conversionRateNum,
         currency,
         pricePerContainer: pricePerContainerNum,
      });

      setPdfLoading(false);
      setPdfSuccess(true);
      setSelected(new Set());
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
                     value={selectedSupplier}
                     onChange={(e) => {
                        setSelectedSupplier(e.target.value);
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
                  {isAnySelected && (
                     <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "space-between" }}
                     >
                        <IconButton onClick={handleDeleteSelected}>
                           <TrashIcon weight="bold" />
                        </IconButton>
                        <IconButton onClick={openExportMenu}>
                           <ExportIcon weight="bold" />
                        </IconButton>
                     </Stack>
                  )}
               </Stack>
            </Stack>
            <Divider sx={{ mt: 5 }} />

            <Box sx={tableScrollContainerSx}>
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
                        <TableCell>供应商</TableCell>
                        <TableCell>数量</TableCell>
                        <TableCell>单价</TableCell>
                        <TableCell>上次更新</TableCell>
                        <TableCell></TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {isTableLoading ? (
                        Array.from({ length: rowsPerPage }).map((_, i) => (
                           <TableRow key={`skeleton-${i}`}>
                              <TableCell padding="checkbox">
                                 <Skeleton variant="rounded" width={24} height={24} />
                              </TableCell>
                              <TableCell>
                                 <Stack direction="row" spacing={2} alignItems="center">
                                    <Skeleton
                                       variant="rounded"
                                       width={80}
                                       height={80}
                                       sx={{ flexShrink: 0 }}
                                    />
                                    <Stack spacing={0.5}>
                                       <Skeleton variant="text" width={200} />
                                       <Skeleton variant="text" width={80} />
                                    </Stack>
                                 </Stack>
                              </TableCell>
                              <TableCell>
                                 <Skeleton variant="text" width={90} />
                              </TableCell>
                              <TableCell>
                                 <Skeleton variant="text" width={20} />
                              </TableCell>
                              <TableCell>
                                 <Skeleton variant="text" width={20} />
                              </TableCell>
                              <TableCell>
                                 <Skeleton variant="text" width={80} />
                              </TableCell>
                              <TableCell>
                                 <Skeleton variant="rounded" width={32} height={32} />
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <>
                           {displayedProducts.map((row) => (
                              <ProductTableRow
                                 key={row.productId}
                                 row={row}
                                 suppliers={suppliers}
                                 isSelected={selected.has(row.productId)}
                                 onToggleSelect={() => handleToggleOne(row.productId)}
                                 onToggleSave={toggleSave}
                              />
                           ))}
                           {displayedProducts.length === 0 && (
                              <TableRow>
                                 <TableCell colSpan={7}>
                                    <Typography variant="body2" textAlign="center">
                                       没有找到相关产品
                                    </Typography>
                                 </TableCell>
                              </TableRow>
                           )}
                        </>
                     )}
                  </TableBody>
               </Table>
            </Box>

            <TablePagination
               rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS]}
               component="div"
               count={totalCount}
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
            onClose={closeExportMenu}
            keepMounted
            PaperProps={{
               classes: {
                  root: "custom-menu",
               },
            }}
         >
            <MenuItem
               onClick={() => {
                  closeExportMenu();
                  setIsExportModalOpen(true);
                  setExportMode("pdf");
               }}
            >
               导出为PDF
            </MenuItem>
            <MenuItem
               onClick={() => {
                  closeExportMenu();
                  setIsExportModalOpen(true);
                  setExportMode("csv");
               }}
            >
               导出为EXCEL
            </MenuItem>
            <MenuItem onClick={closeExportMenu}>分享为链接</MenuItem>
         </Menu>

         <Zoom in={totalCount > 0}>
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
                     共 {totalCount} 项
                     </Typography>
               )}
            </Box>
         </Zoom>
      </Box>
   );
}
