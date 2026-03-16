import React, { useState, useEffect } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import { Plus } from "phosphor-react";
import Nav from "../../core/nav";
import Footer from "../../core/footer";
import SideNav from "../dashboardNav";
import "../../../styles/quotation.css";
import { useUIStateContext } from "../../../contexts/UIStateContextProvider";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import AddOrderDrawer from "./addOrderDrawer";
import { OrderTable } from "./orderTable";
import EditOrderModal from "./editOrderModal";
import { Order } from "../../../types/types";

const OrdersPage = () => {
   const { navOpen, setNavOpen, mainContentStyles, overlay, closeOverlay } =
      useUIStateContext();
   const { deleteOrder } = useProductSupplierClientContext();

   const [addOrderDrawerOpen, setAddOrderDrawerOpen] = useState(false);
   const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

   useEffect(() => {
      document.title = "Fulcrums | 订单";
   }, []);

   const handleDelete = (order: Order) => {
      deleteOrder(order.orderId);
   };

   return (
      <Box className="recent-products-page" sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
         <Nav home={false} searchBar={true} />

         <Box sx={{ px: { xs: 1, sm: 2 }, pb: 4 }}>
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
                     订单
                  </Typography>
               </div>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus />}
                  onClick={() => setAddOrderDrawerOpen(true)}
               >
                  添加
               </Button>
            </Stack>

            <div className="gradient-divider"></div>

            <OrderTable
               onEdit={(order) => setOrderToEdit(order)}
               onDelete={handleDelete}
            />
         </Box>

         <AddOrderDrawer
            open={addOrderDrawerOpen}
            onClose={() => setAddOrderDrawerOpen(false)}
         />

         <EditOrderModal
            open={!!orderToEdit}
            onClose={() => setOrderToEdit(null)}
            order={orderToEdit}
         />

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

         <Footer />
      </Box>
   );
};

export default OrdersPage;
