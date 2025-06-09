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
   Tooltip,
   IconButton,
   Stack,
   Button,
   Snackbar,
   Alert,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   useTheme,
} from "@mui/material";
import { Trash, Plus, PencilSimple } from "phosphor-react";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/quotation.css";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import { Supplier } from "../../types/types";
import { useThemeContext } from "../../contexts/themeContextProvider";
import NewSupplierModal from "../../components/dashboard/supplier/addNewSupplierModal";
import TimeAgoTypography from "../../components/dashboard/product/timeAgoTypography";

interface EditSupplierModalProps {
   open: boolean;
   onClose: () => void;
   supplierToEdit: Supplier | null;
}

interface SupplierForm {
   supplierName: string;
   supplierAddress: string;
   supplierEmail: string;
   supplierPhone: string;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
   open,
   onClose,
   supplierToEdit,
}) => {
   const theme = useTheme();
   const { editSupplier } = useProductSupplierClientContext();

   const [form, setForm] = useState<SupplierForm>({
      supplierName: "",
      supplierAddress: "",
      supplierEmail: "",
      supplierPhone: "",
   });

   const [originalForm, setOriginalForm] = useState<SupplierForm | null>(null);

   useEffect(() => {
      if (open && supplierToEdit) {
         const initialFormState: SupplierForm = {
            supplierName: supplierToEdit.supplierName || "",
            supplierAddress: supplierToEdit.supplierAddress || "",
            supplierEmail: supplierToEdit.supplierEmail || "",
            supplierPhone: supplierToEdit.supplierPhone || "",
         };
         setForm(initialFormState);
         setOriginalForm(initialFormState);
      } else if (!open) {
         setForm({
            supplierName: "",
            supplierAddress: "",
            supplierEmail: "",
            supplierPhone: "",
         });
         setOriginalForm(null);
      }
   }, [open, supplierToEdit]);

   const handleSave = () => {
      if (!supplierToEdit) return;

      const payloadToSend = {
         ...supplierToEdit,
         ...form,
      };

      editSupplier(payloadToSend);
      onClose();
   };

   const handleChange =
      (key: keyof SupplierForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value ?? "";
         setForm((prev) => ({ ...prev, [key]: value }));
      };

   const safeTrim = (str: string | undefined | null): string => {
      return typeof str === "string" ? str.trim() : "";
   };

   const hasRequiredFields = safeTrim(form.supplierName).length > 0;

   const isChanged = useMemo(() => {
      if (!originalForm) return false;
      return (
         safeTrim(form.supplierName) !== safeTrim(originalForm.supplierName) ||
         safeTrim(form.supplierAddress) !==
            safeTrim(originalForm.supplierAddress) ||
         safeTrim(form.supplierEmail) !==
            safeTrim(originalForm.supplierEmail) ||
         safeTrim(form.supplierPhone) !== safeTrim(originalForm.supplierPhone)
      );
   }, [form, originalForm]);

   const canSave = hasRequiredFields && isChanged;

   return (
      <Dialog
         open={open}
         onClose={onClose}
         fullWidth
         maxWidth="sm"
         PaperProps={{
            sx: {
               p: { xs: 1.5, sm: 4.5 },
               borderRadius: 4,
               boxShadow: theme.shadows[24],
            },
         }}
         BackdropProps={{
            sx: {
               bgcolor: "rgba(18, 18, 18, 0.1)",
               backdropFilter: "blur(3px)",
            },
         }}
      >
         <DialogTitle
            sx={{
               fontWeight: 700,
               pb: 1,
               mt: 2,
               fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
         >
            编辑供应商
         </DialogTitle>
         <DialogContent>
            <Stack spacing={2} mt={4}>
               <TextField
                  fullWidth
                  required
                  label="供应商名称"
                  value={form.supplierName}
                  onChange={handleChange("supplierName")}
                  error={!safeTrim(form.supplierName).length && open}
                  helperText={
                     !safeTrim(form.supplierName).length && open
                        ? "供应商名称是必填项"
                        : ""
                  }
               />
               <TextField
                  fullWidth
                  label="供应商地址"
                  value={form.supplierAddress}
                  onChange={handleChange("supplierAddress")}
               />
               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                     fullWidth
                     label="供应商电话"
                     value={form.supplierPhone}
                     onChange={handleChange("supplierPhone")}
                  />
                  <TextField
                     fullWidth
                     label="供应商邮箱"
                     value={form.supplierEmail}
                     onChange={handleChange("supplierEmail")}
                  />
               </Stack>
            </Stack>
         </DialogContent>
         <DialogActions sx={{ pt: 2, px: 3 }}>
            <Button
               fullWidth
               variant="outlined"
               onClick={onClose}
               sx={{ borderRadius: 3.5 }}
               color="info"
            >
               取消
            </Button>
            <Button
               fullWidth
               variant="contained"
               disabled={!canSave}
               sx={{ borderRadius: 3.5 }}
               onClick={handleSave}
            >
               保存
            </Button>
         </DialogActions>
      </Dialog>
   );
};

const SuppliersPage = () => {
   const {
      suppliers,
      products,
      deleteSupplier,
      deletedSupplier,
      editedSupplier,
      setDeletedSupplier,
      setEditedSupplier,
   } = useProductSupplierClientContext();
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();
   const { isDark } = useThemeContext();

   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

   useEffect(() => {
      document.title = "Fulcrums | 供应商管理";
   }, []);

   const suppliersArray = useMemo(
      () => (suppliers ? Object.values(suppliers) : []),
      [suppliers]
   );
   const productsArray = useMemo(
      () => (products ? Object.values(products) : []),
      [products]
   );

   const handleDeleteSupplier = (supplierToDelete: Supplier) => {
      const isAssociated = productsArray.some(
         (p) => p.supplierId === supplierToDelete.supplierId
      );

      if (isAssociated) {
         setError("该供应商有关联产品，无法删除。");
      } else {
         deleteSupplier(supplierToDelete.supplierId);
      }
   };

   const handleEditSupplier = (supplier: Supplier) => {
      setSupplierToEdit(supplier);
      setIsEditModalOpen(true);
   };

   useEffect(() => {
      if (deletedSupplier) {
         setSuccess("供应商已成功删除。");
      }

      setTimeout(() => {
         setDeletedSupplier(false);
      }, 3000);
   }, [deletedSupplier]);

   useEffect(() => {
      if (editedSupplier) {
         setSuccess("供应商已成功更新。");
      }

      setTimeout(() => {
         setEditedSupplier(false);
      }, 3000);
   }, [editedSupplier]);

   const borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0";
   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
         <Nav home={false} searchBar={true} />

         <Box>
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <div className="title-recent">
                  <Typography
                     variant="h6"
                     component="h1"
                     className="title-text-recent"
                     sx={{
                        fontSize: {
                           xs: "2rem",
                           sm: "2.2rem",
                           md: "2.4rem",
                           lg: "2.8rem",
                        },
                     }}
                  >
                     供应商管理
                  </Typography>
               </div>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus />}
                  onClick={() => setIsSupplierModalOpen(true)}
               >
                  添加
               </Button>
            </Box>

            <div className="gradient-divider"></div>

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
                  <Table
                     sx={{
                        minWidth: 800,
                     }}
                     aria-label="suppliers table"
                  >
                     <TableHead
                        sx={{
                           backgroundColor: isDark ? "#191919" : "#f9fafb",
                        }}
                     >
                        <TableRow>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              供应商名称
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              地址
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              电话
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              邮箱
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              上次更新
                           </TableCell>
                           <TableCell
                              align="right"
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                              }}
                           ></TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {suppliersArray.map((supplier) => (
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
                              <TableCell component="th" scope="row">
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
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {supplier.supplierAddress}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {supplier.supplierPhone}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {supplier.supplierEmail}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 <TimeAgoTypography
                                    timestamp={supplier.updatedAt}
                                 />
                              </TableCell>
                              <TableCell
                                 align="right"
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                 }}
                              >
                                 <Tooltip title="删除">
                                    <IconButton
                                       onClick={() =>
                                          handleDeleteSupplier(supplier)
                                       }
                                    >
                                       <Trash />
                                    </IconButton>
                                 </Tooltip>
                                 <Tooltip title="编辑">
                                    <IconButton
                                       onClick={() =>
                                          handleEditSupplier(supplier)
                                       }
                                    >
                                       <PencilSimple />
                                    </IconButton>
                                 </Tooltip>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
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

         <EditSupplierModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            supplierToEdit={supplierToEdit}
         />

         <NewSupplierModal
            open={isSupplierModalOpen}
            onClose={() => setIsSupplierModalOpen(false)}
            isOnline={true}
         />

         <Snackbar
            open={!!error || !!success}
            autoHideDuration={3000}
            onClose={() => {
               setError(null);
               setSuccess(null);
            }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
         >
            <Alert
               onClose={() => {
                  setError(null);
                  setSuccess(null);
               }}
               severity={error ? "error" : "success"}
               sx={{ width: "100%" }}
            >
               {error || success}
            </Alert>
         </Snackbar>

         <Footer />
      </Box>
   );
};

export default SuppliersPage;
