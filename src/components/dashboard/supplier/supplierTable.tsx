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
   Zoom,
   Skeleton,
} from "@mui/material";
import { Trash, PencilSimple, MagnifyingGlass } from "phosphor-react";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { Supplier } from "../../../types/types";
import TimeAgoTypography from "../product/timeAgoTypography";

const ROWS_PER_PAGE_OPTIONS = [5, 20, 50] as const;
const DEFAULT_ROWS_PER_PAGE = 20;
const ROWS_PER_PAGE_STORAGE_KEY = "supplierTable.rowsPerPage";

function getStoredRowsPerPage(): number {
   if (typeof window === "undefined") return DEFAULT_ROWS_PER_PAGE;
   const stored = localStorage.getItem(ROWS_PER_PAGE_STORAGE_KEY);
   if (stored == null) return DEFAULT_ROWS_PER_PAGE;
   const n = parseInt(stored, 10);
   return ROWS_PER_PAGE_OPTIONS.includes(
      n as (typeof ROWS_PER_PAGE_OPTIONS)[number],
   )
      ? n
      : DEFAULT_ROWS_PER_PAGE;
}

export interface SupplierTableProps {
   onEdit: (supplier: Supplier) => void;
   onDelete: (supplier: Supplier) => void;
}

export function SupplierTable({ onEdit, onDelete }: SupplierTableProps) {
   const { suppliers, serviceLoading } = useProductSupplierClientContext();
   const { isDark } = useThemeContext();

   const [searchTerm, setSearchTerm] = useState("");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(getStoredRowsPerPage);

   const suppliersArray = useMemo(
      () => (suppliers ? Object.values(suppliers) : []),
      [suppliers],
   );

   const filteredSuppliers = useMemo(() => {
      let data = [...suppliersArray];
      if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         data = data.filter(
            (s) =>
               s.supplierName?.toLowerCase().includes(lower) ||
               s.supplierAddress?.toLowerCase().includes(lower),
         );
      }
      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();
         return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
      return data;
   }, [suppliersArray, searchTerm, sortOrder]);

   const displayedSuppliers = useMemo(() => {
      const start = page * rowsPerPage;
      return filteredSuppliers.slice(start, start + rowsPerPage);
   }, [filteredSuppliers, page, rowsPerPage]);

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      const value = parseInt(event.target.value, 10);
      setRowsPerPage(value);
      setPage(0);
      try {
         localStorage.setItem(ROWS_PER_PAGE_STORAGE_KEY, String(value));
      } catch {
         /* ignore */
      }
   };

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

   return (
      <Stack>
         <Stack direction="row" spacing={1} alignItems="center" sx={{ pb: 2 }}>
            <TextField
               fullWidth
               variant="outlined"
               size="small"
               placeholder="搜索供应商名称或地址"
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
               <Table sx={{ minWidth: 800 }} aria-label="suppliers table">
                  <TableHead
                     sx={{ backgroundColor: isDark ? "#191919" : "#f9fafb" }}
                  >
                     <TableRow>
                        <TableCell sx={headSx}>供应商名称</TableCell>
                        <TableCell sx={headSx}>地址</TableCell>
                        <TableCell sx={headSx}>电话</TableCell>
                        <TableCell sx={headSx}>邮箱</TableCell>
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
                     {serviceLoading ? (
                        Array.from({ length: rowsPerPage }).map((_, i) => (
                           <TableRow key={`skeleton-${i}`}>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={140} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={180} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={100} />
                              </TableCell>
                              <TableCell sx={cellBorderSx}>
                                 <Skeleton variant="text" width={120} />
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
                           {displayedSuppliers.map((supplier) => (
                              <TableRow
                                 key={supplier.supplierId}
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
                                       variant="body1"
                                       sx={{
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          color: "text.primary",
                                       }}
                                    >
                                       {supplier.supplierName}
                                    </Typography>
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    {supplier.supplierAddress}
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    {supplier.supplierPhone}
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    {supplier.supplierEmail}
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    <TimeAgoTypography
                                       timestamp={supplier.updatedAt}
                                    />
                                 </TableCell>
                                 <TableCell align="right" sx={cellBorderSx}>
                                    <Tooltip title="删除">
                                       <IconButton
                                          onClick={() => onDelete(supplier)}
                                       >
                                          <Trash />
                                       </IconButton>
                                    </Tooltip>
                                    <Tooltip title="编辑">
                                       <IconButton
                                          onClick={() => onEdit(supplier)}
                                       >
                                          <PencilSimple />
                                       </IconButton>
                                    </Tooltip>
                                 </TableCell>
                              </TableRow>
                           ))}
                           {filteredSuppliers.length === 0 && (
                              <TableRow>
                                 <TableCell sx={cellBorderSx}> </TableCell>
                                 <TableCell sx={cellBorderSx}>
                                    <Typography
                                       sx={{ py: 3 }}
                                       color="text.secondary"
                                    >
                                       没有找到相关供应商。
                                    </Typography>
                                 </TableCell>
                                 <TableCell sx={cellBorderSx}> </TableCell>
                                 <TableCell sx={cellBorderSx}> </TableCell>
                                 <TableCell sx={cellBorderSx}> </TableCell>
                                 <TableCell sx={cellBorderSx}> </TableCell>
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
               count={filteredSuppliers.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={(_, newPage) => setPage(newPage)}
               onRowsPerPageChange={handleChangeRowsPerPage}
               labelRowsPerPage="每页显示:"
               labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} / ${count}`
               }
            />

            <Zoom in={filteredSuppliers.length > 0 || serviceLoading}>
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
                  <Typography variant="body1" fontWeight={500}>
                     共 {filteredSuppliers.length} 项
                  </Typography>
               </Box>
            </Zoom>
         </Paper>
      </Stack>
   );
}
