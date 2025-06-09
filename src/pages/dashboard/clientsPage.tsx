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
   InputAdornment,
   MenuItem,
   Select,
} from "@mui/material";
import { Trash, Plus, PencilSimple, MagnifyingGlass } from "phosphor-react";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/quotation.css";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import { Clients } from "../../types/types";
import { useThemeContext } from "../../contexts/themeContextProvider";
import NewClientModal from "./addNewClient";
import TimeAgoTypography from "../../components/dashboard/product/timeAgoTypography";
import Suggestions from "../../components/dashboard/core/suggestion";

interface EditClientModalProps {
   open: boolean;
   onClose: () => void;
   clientToEdit: Clients | null;
}

interface ClientForm {
   companyName: string;
   address: string;
   contactName: string;
   contactPhoneNumber: string;
   contactEmail: string;
   eoriNumber: string;
   vatNumber: string;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
   open,
   onClose,
   clientToEdit,
}) => {
   const theme = useTheme();
   const { editClient } = useProductSupplierClientContext();

   const [form, setForm] = useState<ClientForm>({
      companyName: "",
      address: "",
      contactName: "",
      contactPhoneNumber: "",
      contactEmail: "",
      eoriNumber: "",
      vatNumber: "",
   });

   const [originalForm, setOriginalForm] = useState<ClientForm | null>(null);

   useEffect(() => {
      if (open && clientToEdit) {
         const initialFormState: ClientForm = {
            companyName: clientToEdit.companyName || "",
            address: clientToEdit.address || "",
            contactName: clientToEdit.contactName || "",
            contactPhoneNumber: clientToEdit.contactPhoneNumber || "",
            contactEmail: clientToEdit.contactEmail || "",
            eoriNumber: clientToEdit.eoriNumber || "",
            vatNumber: clientToEdit.vatNumber || "",
         };
         setForm(initialFormState);
         setOriginalForm(initialFormState);
      } else if (!open) {
         // Reset form and originalForm when modal closes
         setForm({
            companyName: "",
            address: "",
            contactName: "",
            contactPhoneNumber: "",
            contactEmail: "",
            eoriNumber: "",
            vatNumber: "",
         });
         setOriginalForm(null);
      }
   }, [open, clientToEdit]);

   const handleSave = () => {
      if (!clientToEdit) return;

      const payloadToSend = {
         clientId: clientToEdit.clientId,
         companyName: form.companyName,
         address: form.address,
         contactName: form.contactName,
         contactPhoneNumber: form.contactPhoneNumber,
         contactEmail: form.contactEmail,
         eoriNumber: form.eoriNumber,
         vatNumber: form.vatNumber,
         updatedAt: new Date().toISOString(),
      };

      editClient(payloadToSend);
      onClose();
   };

   const handleChange =
      (key: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value ?? "";
         setForm((prev) => ({ ...prev, [key]: value }));
      };

   const safeTrim = (str: string | undefined | null): string => {
      return typeof str === "string" ? str.trim() : "";
   };

   const hasRequiredFields =
      safeTrim(form.companyName).length > 0 &&
      safeTrim(form.address).length > 0 &&
      safeTrim(form.contactName).length > 0 &&
      safeTrim(form.contactPhoneNumber).length > 0;

   const isChanged = useMemo(() => {
      if (!originalForm) return false;

      return (
         safeTrim(form.companyName) !== safeTrim(originalForm.companyName) ||
         safeTrim(form.address) !== safeTrim(originalForm.address) ||
         safeTrim(form.contactName) !== safeTrim(originalForm.contactName) ||
         safeTrim(form.contactPhoneNumber) !==
            safeTrim(originalForm.contactPhoneNumber) ||
         safeTrim(form.contactEmail) !== safeTrim(originalForm.contactEmail) ||
         safeTrim(form.eoriNumber) !== safeTrim(originalForm.eoriNumber) ||
         safeTrim(form.vatNumber) !== safeTrim(originalForm.vatNumber)
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
               fontSize: { xs: "2rem", sm: "2.2rem" },
            }}
         >
            编辑客户
         </DialogTitle>
         <DialogContent>
            <Stack spacing={2.5} mt={4}>
               <TextField
                  size="small"
                  required
                  label="公司全称"
                  value={form.companyName}
                  onChange={handleChange("companyName")}
                  error={!safeTrim(form.companyName).length && open}
                  helperText={
                     !safeTrim(form.companyName).length && open
                        ? "公司全称是必填项"
                        : ""
                  }
               />
               <TextField
                  size="small"
                  required
                  label="完整地址"
                  value={form.address}
                  onChange={handleChange("address")}
                  error={!safeTrim(form.address).length && open}
                  helperText={
                     !safeTrim(form.address).length && open
                        ? "完整地址是必填项"
                        : ""
                  }
               />
               <TextField
                  size="small"
                  required
                  label="联系人"
                  value={form.contactName}
                  onChange={handleChange("contactName")}
                  error={!safeTrim(form.contactName).length && open}
                  helperText={
                     !safeTrim(form.contactName).length && open
                        ? "联系人是必填项"
                        : ""
                  }
               />
               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                     fullWidth
                     size="small"
                     required
                     label="电话号码"
                     value={form.contactPhoneNumber}
                     onChange={handleChange("contactPhoneNumber")}
                     error={!safeTrim(form.contactPhoneNumber).length && open}
                     helperText={
                        !safeTrim(form.contactPhoneNumber).length && open
                           ? "电话号码是必填项"
                           : ""
                     }
                  />
                  <TextField
                     fullWidth
                     size="small"
                     label="电子邮件地址"
                     value={form.contactEmail}
                     onChange={handleChange("contactEmail")}
                  />
               </Stack>
               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                     fullWidth
                     size="small"
                     label="VAT 增值税号"
                     value={form.vatNumber}
                     onChange={handleChange("vatNumber")}
                  />
                  <TextField
                     fullWidth
                     size="small"
                     label="EORI 编号"
                     value={form.eoriNumber}
                     onChange={handleChange("eoriNumber")}
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

const ClientsPage = () => {
   const {
      clients,
      products,
      deleteClient,
      deletedClient,
      setDeletedClient,
      editedClient,
      setEditedClient,
   } = useProductSupplierClientContext();
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();
   const { isDark, isSmUp } = useThemeContext();

   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [isClientModalOpen, setIsClientModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [clientToEdit, setClientToEdit] = useState<Clients | null>(null);

   const [searchTerm, setSearchTerm] = useState("");
   const [sortOrder, setSortOrder] = useState("desc");

   const toggleClientModal = (): void => {
      setIsClientModalOpen((prev) => !prev);
   };

   useEffect(() => {
      document.title = "Fulcrums | 客户管理";
   }, []);

   const clientsArray = useMemo(
      () => (clients ? Object.values(clients) : []),
      [clients]
   );
   const productsArray = useMemo(
      () => (products ? Object.values(products) : []),
      [products]
   );

   const processedClients = useMemo(() => {
      let data = [...clientsArray];

      if (searchTerm) {
         const lowercasedFilter = searchTerm.toLowerCase();
         data = data.filter(
            (client: Clients) =>
               client.companyName?.toLowerCase().includes(lowercasedFilter) ||
               client.address?.toLowerCase().includes(lowercasedFilter) ||
               client.contactName?.toLowerCase().includes(lowercasedFilter)
         );
      }

      data.sort((a, b) => {
         const dateA = new Date(a.updatedAt).getTime();
         const dateB = new Date(b.updatedAt).getTime();
         return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });

      return data;
   }, [clientsArray, searchTerm, sortOrder]);

   const handleDeleteClient = (clientToDelete: Clients) => {
      const isAssociated = productsArray.some((p) =>
         p.clients?.includes(clientToDelete.clientId)
      );

      if (isAssociated) {
         setError("该客户有关联产品，无法删除。");
      } else {
         deleteClient(clientToDelete.clientId);
      }
   };

   const handleEditClient = (client: Clients) => {
      setClientToEdit(client);
      setIsEditModalOpen(true);
   };

   useEffect(() => {
      if (deletedClient) {
         setSuccess("客户已成功删除。");
         const timer = setTimeout(() => setDeletedClient(false), 3000);
         return () => clearTimeout(timer);
      }
   }, [deletedClient, setDeletedClient]);

   useEffect(() => {
      if (editedClient) {
         setSuccess("更改成功。");
         const timer = setTimeout(() => setEditedClient(false), 3000);
         return () => clearTimeout(timer);
      }
   }, [setEditedClient, editedClient]);

   const handleAddClient = () => {
      toggleClientModal();
   };

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
                     客户管理
                  </Typography>
               </div>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus />}
                  onClick={handleAddClient}
               >
                  添加
               </Button>
            </Box>

            <div className="gradient-divider"></div>

            <Stack
               direction="row"
               spacing={1}
               alignItems="center"
               sx={{ mt: 2, mb: 2 }}
            >
               <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="搜索公司名称, 地址, 或联系人"
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
               <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
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
                  <Table
                     sx={{
                        minWidth: 1000,
                     }}
                     aria-label="clients table"
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
                              公司名称
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              联系人
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              联系电话
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              联系邮箱
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
                              VAT号
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                                 textWrap: "nowrap",
                              }}
                           >
                              EORI号
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
                        {processedClients.map((client: Clients) => (
                           <TableRow
                              key={client.clientId}
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
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                 }}
                              >
                                 <a href={`/client/${client.clientId}`}>
                                    <Typography
                                       variant="body1"
                                       sx={{
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          color: "text.primary",
                                       }}
                                    >
                                       {client.companyName}
                                    </Typography>
                                 </a>
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.contactName}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.contactPhoneNumber}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.contactEmail}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.address}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.vatNumber}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 {client.eoriNumber}
                              </TableCell>
                              <TableCell
                                 sx={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    color: "text.secondary",
                                 }}
                              >
                                 <TimeAgoTypography
                                    timestamp={client.updatedAt}
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
                                          handleDeleteClient(client)
                                       }
                                    >
                                       <Trash />
                                    </IconButton>
                                 </Tooltip>
                                 <Tooltip title="编辑">
                                    <IconButton
                                       onClick={() => handleEditClient(client)}
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

         <NewClientModal
            open={isClientModalOpen}
            onClose={toggleClientModal}
            isOnline={true}
         />

         <EditClientModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            clientToEdit={clientToEdit}
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

         <Suggestions
            suggestions={[
               { title: "最近的产品", link: "/dashboard/recent" },
               { title: "保存的产品", link: "/dashboard/saved" },
               { title: "添加新产品", link: "/dashboard/add-product" },
            ]}
         />

         <Footer />
      </Box>
   );
};

export default ClientsPage;
