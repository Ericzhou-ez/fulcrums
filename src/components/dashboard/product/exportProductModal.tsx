import { useState, useMemo } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Stack,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Typography,
   Box,
   useTheme,
   Slide,
   SlideProps,
} from "@mui/material";
import Loader from "../../core/loader";
import { useThemeContext } from "../../../contexts/themeContextProvider";
import React from "react";
import { exportInternalProductCSV } from "../../../lib/InternalProductCSVBuilder";

interface SubmitProps {
   currency: string;
   toggleCurrency: (c: string) => void;
   isFormComplete: boolean;
   upNum: number;
   rateNum: number;
   pcNum: number;
   onClient: (u: number, r: number, c: string, p: number) => void;
   onInternal: (u: number, r: number, c: string, p: number) => void;
   onClose: () => void;
   formState: ReturnType<typeof useForm>;
   resetForm: any;
   exportType: "csv" | "pdf" | "";
   onClientCsv: any;
   onInternalCsv: any;
}

function useForm() {
   const [upCharge, setUpCharge] = useState("");
   const [conversionRate, setConversionRate] = useState("");
   const [pricePerContainer, setPriceCont] = useState("");

   const resetForm = () => {
      setUpCharge("");
      setConversionRate("");
      setPriceCont("");
   };

   const upNum = parseFloat(upCharge);
   const rateNum = parseFloat(conversionRate);
   const pcNum = parseFloat(pricePerContainer);

   const isFormComplete = useMemo(() => {
      return (
         !isNaN(upNum) &&
         upNum >= 1.01 &&
         upNum < 10 &&
         !isNaN(rateNum) &&
         rateNum > 0 &&
         rateNum < 100 &&
         !isNaN(pcNum) &&
         pcNum > 0
      );
   }, [upCharge, conversionRate, pricePerContainer]);

   return {
      upCharge,
      setUpCharge,
      conversionRate,
      setConversionRate,
      pricePerContainer,
      setPriceCont,
      upNum,
      rateNum,
      pcNum,
      isFormComplete,
      resetForm,
   };
}

/*                                Loading component                           */

function LoadingSection() {
   return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
         <Loader />
         <Typography>下载中…</Typography>
      </Stack>
   );
}

/*                             Submission component                         */

function SubmitSection({
   currency,
   toggleCurrency,
   isFormComplete,
   upNum,
   rateNum,
   pcNum,
   onClient,
   onInternal,
   onClose,
   formState,
   resetForm,
   exportType,
   onClientCsv,
   onInternalCsv,
}: SubmitProps) {
   return (
      <>
         <DialogContent sx={{ pt: 0, pb: 6 }}>
            <Typography mb={2}>
               您想要<strong>内部导出</strong>还是<strong>导出给客户</strong>？
            </Typography>

            <Stack spacing={1.5}>
               <TextField
                  label="加价幅度"
                  type="number"
                  placeholder="1.05"
                  value={formState.upCharge}
                  onChange={(e) => formState.setUpCharge(e.target.value)}
                  helperText="5% 为 1.05"
               />

               <TextField
                  label="设置汇率"
                  type="number"
                  placeholder={currency === "€" ? "8.20" : "7.20"}
                  value={formState.conversionRate}
                  onChange={(e) => formState.setConversionRate(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Box display="flex" alignItems="center">
                              ¥ →
                              <IconButton
                                 size="small"
                                 sx={{ ml: 0.5 }}
                                 onClick={() => toggleCurrency(currency)}
                              >
                                 {currency}
                              </IconButton>
                           </Box>
                        </InputAdornment>
                     ),
                  }}
               />

               <TextField
                  label="每柜价格"
                  type="number"
                  placeholder={currency === "€" ? "4000" : "4500"}
                  value={formState.pricePerContainer}
                  onChange={(e) => formState.setPriceCont(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <IconButton
                              onClick={() => toggleCurrency(currency)}
                              sx={{
                                 fontSize: "1rem",
                              }}
                           >
                              {currency}
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
               />
            </Stack>
         </DialogContent>

         <DialogActions sx={{ pt: 0, pb: 3 }}>
            <Stack spacing={1.5} width="100%">
               <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  disabled={!isFormComplete}
                  onClick={() => {
                     exportType === "pdf"
                        ? onClient(upNum, rateNum, currency, pcNum)
                        : onClientCsv(upNum, rateNum, currency, pcNum);
                     resetForm();
                  }}
               >
                  导出给客户
               </Button>

               <Button
                  fullWidth
                  variant="outlined"
                  color="info"
                  disabled={!isFormComplete}
                  onClick={() => {
                     exportType === "pdf"
                        ? onInternal(upNum, rateNum, currency, pcNum)
                        : onInternalCsv(upNum, rateNum, currency, pcNum);

                     resetForm();
                  }}
               >
                  内部导出
               </Button>
               <Button fullWidth variant="text" onClick={onClose}>
                  取消
               </Button>
            </Stack>
         </DialogActions>
      </>
   );
}

/*                              Export Dialog shell                           */

interface ExportDialogProps {
   open: boolean;
   onClose: () => void;
   pdfLoading: boolean;
   currency: string;
   toggleCurrency: (c: string) => void;
   onClientExport: (
      up: number,
      rate: number,
      currency: string,
      price: number
   ) => void;
   onInternalExport: (
      up: number,
      rate: number,
      currency: string,
      price: number
   ) => void;
   exportType: "csv" | "pdf" | "";
   onClientCsv: any;
   onInternalCsv: any;
}

export default function ExportDialog({
   open,
   onClose,
   pdfLoading,
   currency,
   toggleCurrency,
   onClientExport,
   onInternalExport,
   exportType,
   onClientCsv,
   onInternalCsv,
}: ExportDialogProps) {
   const form = useForm();
   const { isMdUp } = useThemeContext();

   return (
      <Dialog
         open={open}
         onClose={() => !pdfLoading && onClose()}
         {...(!isMdUp && { TransitionComponent: SlideUp })}
         fullWidth
         maxWidth={false}
         sx={{
            "& .MuiDialog-container": {
               justifyContent: { xs: "flex-end", sm: "center" },
               alignItems: { xs: "flex-end", sm: "center" },
            },
         }}
         PaperProps={{
            sx: {
               m: 0,
               bottom: { xs: 0, sm: "auto" },
               p: { xs: 1.5, sm: 3 },
               borderTopLeftRadius: { xs: 5, sm: 0 },
               borderTopRightRadius: { xs: 5, sm: 0 },
               borderRadius: { xs: 0, sm: 3 },
               width: { xs: "100vw", sm: "auto" },
               maxWidth: { xs: "100vw", sm: 400 },
               bgcolor: "background.default",
            },
         }}
         BackdropProps={{
            sx: { bgcolor: "rgba(18,18,18,0.08)", backdropFilter: "blur(3px)" },
         }}
      >
         <DialogTitle
            sx={{ pb: 1, pt: 3, fontWeight: 600, fontSize: "1.8rem" }}
         >
            请选择导出类型
         </DialogTitle>

         {pdfLoading ? (
            <LoadingSection />
         ) : (
            <SubmitSection
               currency={currency}
               toggleCurrency={toggleCurrency}
               isFormComplete={form.isFormComplete}
               upNum={form.upNum}
               rateNum={form.rateNum}
               pcNum={form.pcNum}
               onClient={onClientExport}
               onInternal={onInternalExport}
               onClose={onClose}
               formState={form}
               resetForm={form.resetForm}
               exportType={exportType}
               onClientCsv={onClientCsv}
               onInternalCsv={onInternalCsv}
            />
         )}
      </Dialog>
   );
}

export const SlideUp = React.forwardRef(function SlideUp(
   props: SlideProps,
   ref: React.Ref<unknown>
) {
   return <Slide direction="up" ref={ref} {...props} />;
});
