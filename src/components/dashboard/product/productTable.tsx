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
} from "@mui/material";
import {
   Image as ImageIcon,
   MagnifyingGlass as MagnifyingGlassIcon,
   PencilSimple as PencilSimpleIcon,
   Heart as HeartIcon,
} from "phosphor-react";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { Product } from "../../../types/types";
import { typeOptions } from "../search/productFilter";
import HeartComponent from "./heart";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import Loader from "../../core/loader";

export function ProductTable({ productList }: { productList: Product[] }) {
   const { toggleSaveUnsaveProduct, productLoading } =
      useProductSupplierClientContext();
   async function toggleSave(productId: string) {
      await toggleSaveUnsaveProduct(productId);
   }
   const { isDark, isSmUp } = useThemeContext();
   const [searchTerm, setSearchTerm] = React.useState("");
   const [category, setCategory] = React.useState("all");
   const [sortOrder, setSortOrder] = React.useState("desc");
   const [products, setProducts] = React.useState<Product[]>([]);

   React.useEffect(() => {
      setProducts(productList);
   }, [productList]);

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
         data = data.filter((item) => item.catagory === category);
      }

      // to be actually sorted by date
      data.sort((a, b) => {
         if (sortOrder === "desc") {
            return b.productId.localeCompare(a.productId);
         } else {
            return a.productId.localeCompare(b.productId);
         }
      });

      return data;
   }, [products, searchTerm, category, sortOrder]);

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

   const handleDeleteSelected = () => {
      setProducts((prev) => prev.filter((p) => !selected.has(p.productId)));

      setSelected(new Set());
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
               direction={`${isSmUp ? "row" : "column"}`}
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
                     <Button
                        variant="contained"
                        color="info"
                        onClick={handleDeleteSelected}
                        sx={{
                           textWrap: "nowrap",
                           width: "fit",
                        }}
                     >
                        删除
                     </Button>
                  )}
               </Stack>
            </Stack>
            <Divider sx={{ mt: 5 }} />

            <Box sx={{ overflowX: "auto" }}>
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
                                    )?.label || row.catagory}
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

                     {productLoading
                        ? ""
                        : displayedProducts.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={6}>
                                   <Typography
                                      variant="body2"
                                      textAlign="center"
                                   >
                                      没有找到相关产品
                                   </Typography>
                                </TableCell>
                             </TableRow>
                          )}

                     {productLoading && (
                        <TableRow>
                           <TableCell colSpan={6}>
                              <Stack
                                 direction="row"
                                 gap={1.5}
                                 justifyContent="center"
                                 alignItems="center"
                              >
                                 <Typography variant="body2" textAlign="center">
                                    拼命加载中...
                                 </Typography>
                                 <Loader />
                              </Stack>
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
      </Box>
   );
}
