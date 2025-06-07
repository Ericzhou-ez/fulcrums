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
} from "@mui/material";
import { Trash, Plus } from "phosphor-react";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import "../../styles/quotation.css";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import { Clients } from "../../types/types";
import { useThemeContext } from "../../contexts/themeContextProvider";
import NewClientModal from "./addNewClient";

const ClientInfoTooltip = ({ client }: { client: Clients }) => (
   <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
         {client.companyName}
      </Typography>
      <Stack spacing={0.5}>
         <Typography variant="body2">
            <strong>联系人:</strong> {client.contactName || "N/A"}
         </Typography>
         <Typography variant="body2">
            <strong>电话:</strong> {client.contactPhoneNumber || "N/A"}
         </Typography>
         <Typography variant="body2">
            <strong>邮箱:</strong> {client.contactEmail || "N/A"}
         </Typography>
         <Typography variant="body2">
            <strong>地址:</strong> {client.address || "N/A"}
         </Typography>
         <Typography variant="body2">
            <strong>VAT号:</strong> {client.vatNumber || "N/A"}
         </Typography>
         <Typography variant="body2">
            <strong>EORI号:</strong> {client.eoriNumber || "N/A"}
         </Typography>
      </Stack>
   </Box>
);

const ClientsPage = () => {
   const { clients, products, deleteClient, deletedClient, setDeletedClient } =
      useProductSupplierClientContext();
   const { navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles } =
      useUIStateContext();
   const { isDark } = useThemeContext();

   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [isClientModalOpen, setIsClientModalOpen] = useState(false);

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

   useEffect(() => {
      if (deletedClient) {
         setSuccess("客户已成功删除。");
         setTimeout(() => {
            setDeletedClient(false);
         }, 3000);
      } else {
         return;
      }
   }, [deleteClient]);

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

            <Paper
               sx={{
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`,
                  boxShadow: isDark ? "none" : "0 4px 20px (0,0,0,0.06)",
                  overflow: "hidden",
                  backgroundColor: "background.paper",
               }}
            >
               <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="clients table">
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
                              }}
                           >
                              公司名称
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                              }}
                           >
                              联系人
                           </TableCell>
                           <TableCell
                              sx={{
                                 fontWeight: 600,
                                 color: "text.secondary",
                                 borderBottom: `1px solid ${borderColor}`,
                              }}
                           >
                              地址
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
                        {clientsArray.map((client) => (
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
                                 <Tooltip
                                    title={
                                       <ClientInfoTooltip client={client} />
                                    }
                                    placement="bottom-start"
                                    arrow
                                 >
                                    <Typography
                                       variant="body1"
                                       sx={{
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          color: "text.primary", // Adapts to theme
                                       }}
                                    >
                                       {client.companyName}
                                    </Typography>
                                 </Tooltip>
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
                                 {client.address}
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

export default ClientsPage;
