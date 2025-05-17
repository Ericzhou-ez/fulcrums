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
import { Clients, Product, ProductType } from "../../../types/types";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { useUIStateContext } from "../../../contexts/UIStateContextProvider";
import { BuildInternalProductPDF } from "../../../lib/InteralProductsPDFBuilder";
import { ExternalPDFBuilder } from "../../../lib/externalPDFBuilder";
import { typeOptions } from "../search/productFilter";
import HeartComponent from "./heart";
import Loader from "../../core/loader";

export function ProductTable({ productList }: { productList: ProductType[] }) {
   const { toggleSaveUnsaveProduct, deleteProducts, clients } =
      useProductSupplierClientContext();

   async function toggleSave(productId: string) {
      await toggleSaveUnsaveProduct(productId);
   }

   const { navOpen } = useUIStateContext();
   const { isDark, isSmUp } = useThemeContext();
   const [searchTerm, setSearchTerm] = React.useState("");
   const [category, setCategory] = React.useState("all");
   const [selectedClient, setSelectedClient] = React.useState("all");
   const [client, setClient] = React.useState<Clients[] | undefined>(undefined);
   const [sortOrder, setSortOrder] = React.useState("desc");
   const [products, setProducts] = React.useState<Product[]>([]);
   const [open, setOpen] = React.useState(false);
   const [pdfLoading, setPdfLoading] = React.useState(false);
   const [pdfSuccess, setPdfSuccess] = React.useState(false);
   const [upCharge, setUpCharge] = React.useState("");
   const [upChargeNum, setUpChargeNum] = React.useState(0);
   const [errorMessage, setErrorMessage] = React.useState("");
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   React.useEffect(() => {
      setProducts(productList);
   }, [productList]);

   React.useEffect(() => {
      setClient(Object.values(clients));
   }, []);

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
               item.productChineseName.includes(searchTerm)
         );
      }

      if (category !== "all") {
         data = data.filter((item) => item?.catagory === category);
      }

      if (selectedClient !== "all") {
         data = data.filter((p) => p.clientId === selectedClient);
      }

      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();

         return sortOrder === "desc"
            ? dateB - dateA // latest first
            : dateA - dateB; // oldest first
      });

      return data;
   }, [products, searchTerm, category, sortOrder, selectedClient]);

   const displayedProducts = React.useMemo(() => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
   }, [filteredProducts, page, rowsPerPage]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(0);
   };
   const handleCategoryChange = (e: any) => {
      setCategory(e.target.value);
      setPage(0);
   };
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

   const handleInternal = async () => {
      if (upChargeNum < 1.01 || upChargeNum >= 10 || isNaN(upChargeNum)) return;

      setPdfLoading(true);

      await BuildInternalProductPDF({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, ProductType>),
         upCharge: upChargeNum,
      });

      setPdfLoading(false);
      setPdfSuccess(true);

      setTimeout(() => {
         setOpen(false);
         setPdfSuccess(false);
      }, 2000);
   };

   const handleClient = async () => {
      if (upChargeNum < 1.01 || upChargeNum >= 10 || isNaN(upChargeNum)) return;

      setPdfLoading(true);

      await ExternalPDFBuilder({
         products: selectedProductsList.reduce((acc, product) => {
            acc[product.productId] = product;
            return acc;
         }, {} as Record<string, ProductType>),
         upCharge: upChargeNum,
      });

      setPdfLoading(false);
      setPdfSuccess(true);

      setTimeout(() => {
         setOpen(false);
         setPdfSuccess(false);
      }, 2000);
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
                  gap={2}
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
                           {c.name}
                        </MenuItem>
                     ))}
                  </Select>
                  <Select
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
                  </Select>
                  {isAnySelected && (
                     <Stack
                        direction="row"
                        spacing={1}
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
                        <TableCell>类别</TableCell>
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
                           currency: "USD", // to be updated with actual currency
                        }).format(row.unitPrice);

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
                                    {typeOptions.find(
                                       (option) => option.value === row.catagory
                                    )?.label || "---"}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography variant="inherit" noWrap>
                                    {row.supplier.name}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography variant="inherit" noWrap>
                                    {row.packaging}
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

         {open && (
            <Dialog
               open={open}
               onClose={() => setOpen(false)}
               PaperProps={{
                  sx: { p: 3, borderRadius: 3, minWidth: 200 },
               }}
               BackdropProps={{
                  sx: {
                     bgcolor: "rgba(18, 18, 18, 0.1)",
                     backdropFilter: "blur(3px)",
                  },
               }}
            >
               {pdfLoading ? (
                  <Stack direction={"column"} spacing={2} alignItems="center">
                     <Loader />
                     <p>下载中...</p>
                  </Stack>
               ) : (
                  <div>
                     <DialogTitle
                        sx={{ pb: 1, fontWeight: 600, fontSize: "1.6rem" }}
                     >
                        请选择导出类型
                     </DialogTitle>

                     <DialogContent sx={{ pt: 0, pb: 8 }}>
                        <Typography>
                           您想要<strong>内部导出</strong>还是
                           <strong>导出给客户</strong>？
                        </Typography>
                     </DialogContent>

                     <DialogActions sx={{ pt: 0 }}>
                        <Stack
                           direction="column"
                           spacing={1.5}
                           sx={{
                              width: "100%",
                              justifyContent: "space-between",
                           }}
                        >
                           <TextField
                              type="number"
                              label="加价幅度"
                              value={upCharge}
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setUpCharge(val);

                                 const num = parseFloat(val);
                                 if (val === "") {
                                    setErrorMessage("请输入数字");
                                 } else if (
                                    isNaN(num) ||
                                    num < 1.01 ||
                                    num >= 10
                                 ) {
                                    setErrorMessage("请输入有效的数字");
                                 } else {
                                    setErrorMessage("");
                                    setUpChargeNum(num);
                                 }
                              }}
                              error={!!errorMessage}
                              helperText={errorMessage || "5% 为 1.05"}
                           />
                           <Button
                              fullWidth
                              onClick={handleClient}
                              variant="contained"
                              color="info"
                              sx={{
                                 borderRadius: 2,
                              }}
                           >
                              导出给客户
                           </Button>
                           <Button
                              fullWidth
                              onClick={handleInternal}
                              variant="outlined"
                              color="info"
                              sx={{
                                 borderRadius: 2,
                              }}
                           >
                              内部导出
                           </Button>

                           <Button
                              fullWidth
                              onClick={() => setOpen(false)}
                              variant="text"
                              sx={{
                                 borderRadius: 2,
                              }}
                           >
                              取消
                           </Button>
                        </Stack>
                     </DialogActions>
                  </div>
               )}
            </Dialog>
         )}

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
                  setOpen(true);
               }}
            >
               导出为PDF
            </MenuItem>
            <MenuItem onClick={handleClose}>导出为EXCEL</MenuItem>
            <MenuItem onClick={handleClose}>分享为链接</MenuItem>
         </Menu>
      </Box>
   );
}
