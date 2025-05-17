import * as React from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Box,
   Stack,
   TextField,
   Button,
   useTheme,
} from "@mui/material";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";

interface NewClientModalProps {
   open: boolean;
   onClose: () => void;
}

export interface ClientForm {
   companyName: string;
   address: string;
   contactName: string;
   contactPhoneNumber: string;
   contactEmail: string;
   eoriNumber: string;
   vatNumber: string;
}

const emptyForm: ClientForm = {
   companyName: "",
   address: "",
   contactName: "",
   contactPhoneNumber: "",
   contactEmail: "",
   eoriNumber: "",
   vatNumber: "",
};

const fieldMeta: Array<{
   key: keyof ClientForm;
   label: string;
   required?: boolean;
}> = [
   { key: "companyName", label: "公司全称", required: true },
   { key: "address", label: "完整地址", required: true },
   { key: "contactName", label: "联系人", required: true },
   { key: "contactPhoneNumber", label: "电话号码", required: true },
   { key: "contactEmail", label: "电子邮件地址" },
   { key: "eoriNumber", label: "EORI 编号" },
   { key: "vatNumber", label: "VAT 增值税号" },
];

const NewClientModal: React.FC<NewClientModalProps> = ({ open, onClose }) => {
   const theme = useTheme();
   const [form, setForm] = React.useState<ClientForm>(emptyForm);
   const { addClient } = useProductSupplierClientContext();

   const handleSave = () => {
      addClient(form); 

      setForm(emptyForm); 
      onClose(); 
   };

   const handleChange =
      (key: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
         setForm((prev) => ({ ...prev, [key]: e.target.value }));

   const canSave = fieldMeta
      .filter((f) => f.required)
      .every((f) => form[f.key].trim());

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
               fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
         >
            添加新客户
         </DialogTitle>

         <DialogContent>
            <Stack spacing={2.5} mt={4}>
               {fieldMeta.map(({ key, label, required }) => (
                  <Box
                     key={key}
                     sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        alignItems: "center",
                     }}
                  >
                     <TextField
                        size="small"
                        required={required}
                        value={form[key]}
                        onChange={handleChange(key)}
                        label={label}
                     />
                  </Box>
               ))}
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

export default NewClientModal;
