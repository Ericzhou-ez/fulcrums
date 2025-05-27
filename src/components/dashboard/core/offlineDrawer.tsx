/* eslint-disable react-hooks/exhaustive-deps */

import {
   useState,
   useEffect,
   Fragment,
   SyntheticEvent,
   ChangeEvent,
} from "react";
import {
   Box,
   Collapse,
   Grow,
   Typography,
   Drawer,
   Tabs,
   Tab,
   List,
   ListItem,
   ListItemText,
   Divider,
   CircularProgress,
   TextField,
   Button,
   IconButton,
   Grid,
   Stack,
   InputAdornment,
   Tooltip,
} from "@mui/material";
import {
   CloudSlash,
   Package,
   ArrowLeft,
   X as DeleteIcon,
   ArrowsClockwise,
   CheckCircle,
} from "phosphor-react";
import { deleteRecord, db } from "../../../lib/dexieUtils";
import getBase64FromBlobUrl from "../../../lib/blob-to-blob64";
import { Product, Supplier, Clients } from "../../../types/types";
import { useLiveQuery } from "dexie-react-hooks";

/* ──────────────────────────────────────────────────────────── */
/*  MAIN                                                        */
/* ──────────────────────────────────────────────────────────── */
interface OfflineDrawerProps {
   isOnline: boolean;
}

export function OfflineDrawer({ isOnline }: OfflineDrawerProps) {
   const [showCloud, setShowCloud] = useState(true);
   const [open, setOpen] = useState(false);
   const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">(
      "idle"
   );

   const productCount = useLiveQuery(() => db.products.count(), []);
   const supplierCount = useLiveQuery(() => db.suppliers.count(), []);
   const clientCount = useLiveQuery(() => db.clients.count(), []);

   useEffect(() => {
      if (!isOnline) {
         const t = setTimeout(() => setShowCloud(false), 1200);
         return () => clearTimeout(t);
      }
      setShowCloud(true);
   }, [isOnline]);

   const startSync = () => {
      if (syncState !== "idle") return;

      setSyncState("syncing");

      // TODO: replace setTimeout with real sync promise
      setTimeout(() => setSyncState("done"), 2500);
   };

   const showSync =
      isOnline && (productCount! > 0 || supplierCount! > 0 || clientCount! > 0);

   return (
      <>
         {showSync && (
            <Tooltip
               title={
                  syncState === "idle"
                     ? "同步到云端"
                     : syncState === "syncing"
                     ? "同步中…"
                     : "已完成"
               }
            >
               <IconButton
                  onClick={startSync}
                  color={syncState === "done" ? "success" : "primary"}
                  sx={{
                     position: "fixed",
                     bottom: 16,
                     right: 16,
                     zIndex: 40,
                     border: "0.5px solid",
                     bgcolor: "background.paper",
                     animation:
                        syncState === "syncing"
                           ? "spin 1s linear infinite"
                           : "none",
                     "@keyframes spin": {
                        to: { transform: "rotate(360deg)" },
                     },
                  }}
               >
                  {syncState === "done" ? (
                     <CheckCircle size={26} weight="fill" />
                  ) : (
                     <ArrowsClockwise size={26} weight="bold" />
                  )}
               </IconButton>
            </Tooltip>
         )}

         {!showSync && (
            <Grow in>
               <Box
                  onClick={() => setOpen(true)}
                  sx={{
                     position: "fixed",
                     bottom: 16,
                     right: 16,
                     display: "flex",
                     alignItems: "center",
                     px: 1.25,
                     py: 0.75,
                     borderRadius: 999,
                     boxShadow: 4,
                     bgcolor: "background.paper",
                     cursor: "pointer",
                     zIndex: 30,
                  }}
               >
                  <Collapse
                     in={showCloud}
                     orientation="horizontal"
                     timeout={400}
                  >
                     <CloudSlash size={20} weight="fill" />
                  </Collapse>

                  <Collapse
                     in={!showCloud}
                     orientation="horizontal"
                     timeout={400}
                  >
                     <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                     >
                        <Package size={18} weight="fill" />
                        <Typography
                           variant="caption"
                           sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                        >
                           {productCount ?? "…"}
                        </Typography>
                     </Box>
                  </Collapse>
               </Box>
            </Grow>
         )}

         <EntityDrawer open={open} onClose={() => setOpen(false)} />
      </>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*  DRAWER                                                      */
/* ──────────────────────────────────────────────────────────── */
type TabKey = "products" | "suppliers" | "clients";

interface EntityDrawerProps {
   open: boolean;
   onClose: () => void;
}
function EntityDrawer({ open, onClose }: EntityDrawerProps) {
   const [tab, setTab] = useState<TabKey>("products");
   const [view, setView] = useState<"list" | "detail">("list");
   const [select, setSelect] = useState<Product | Supplier | Clients | null>(
      null
   );

   const products = useLiveQuery(() => db.products.toArray(), []);
   const suppliers = useLiveQuery(() => db.suppliers.toArray(), []);
   const clients = useLiveQuery(() => db.clients.toArray(), []);

   const handleSave = async (updated: any, close = false) => {
      const table =
         tab === "products"
            ? "products"
            : tab === "suppliers"
            ? "suppliers"
            : "clients";

      await db.table(table).put(updated);

      if (close) setView("list");
   };

   const handleDelete = async (item: Product | Supplier | Clients) => {
      const table =
         tab === "products"
            ? "products"
            : tab === "suppliers"
            ? "suppliers"
            : "clients";

      const id =
         table === "products"
            ? (item as Product).productId
            : table === "suppliers"
            ? (item as Supplier).supplierId
            : (item as Clients).clientId;

      await deleteRecord(table as any, id);
   };

   return (
      <Drawer
         anchor="bottom"
         open={open}
         onClose={onClose}
         ModalProps={{ keepMounted: true, disableScrollLock: false }}
         PaperProps={{
            sx: {
               height: "90dvh",
               borderTopLeftRadius: 16,
               borderTopRightRadius: 16,
            },
         }}
      >
         {view === "list" && (
            <Tabs
               value={tab}
               onChange={(_e: SyntheticEvent, v: TabKey) => {
                  setTab(v);
                  setView("list");
               }}
               variant="fullWidth"
               sx={{ borderBottom: 1, borderColor: "divider", pt: 1 }}
            >
               <Tab label="产品" value="products" />
               <Tab label="供应商" value="suppliers" />
               <Tab label="客户" value="clients" />
            </Tabs>
         )}

         <Box
            sx={{
               height: "90dvh",
               overflowY: "auto",
               p: 1.5,
               scrollbarWidth: "none",
               "&::-webkit-scrollbar": { display: "none" },
            }}
         >
            {view === "list" && (
               <>
                  {tab === "products" && (
                     <EntityList<Product>
                        loading={products === undefined}
                        items={products ?? []}
                        primary={(p) =>
                           p.productChineseName || p.productEnglishName
                        }
                        secondary={(p) =>
                           `${p.currency ?? ""}${p.unitPrice ?? ""}  •  ${
                              p.material ?? ""
                           }`
                        }
                        avatarSrc={(p) => p.image}
                        onSelect={(p) => {
                           setSelect(p);
                           setView("detail");
                        }}
                        onDelete={handleDelete}
                     />
                  )}

                  {tab === "suppliers" && (
                     <EntityList<Supplier>
                        loading={suppliers === undefined}
                        items={suppliers ?? []}
                        primary={(s) => s.supplierName}
                        secondary={(s) => s.supplierAddress ?? ""}
                        onSelect={(s) => {
                           setSelect(s);
                           setView("detail");
                        }}
                        onDelete={handleDelete}
                     />
                  )}

                  {tab === "clients" && (
                     <EntityList<Clients>
                        loading={clients === undefined}
                        items={clients ?? []}
                        primary={(c) => c.companyName}
                        secondary={(c) => c.contactName ?? ""}
                        onSelect={(c) => {
                           setSelect(c);
                           setView("detail");
                        }}
                        onDelete={handleDelete}
                     />
                  )}
               </>
            )}

            {view === "detail" && select && (
               <DetailForm
                  item={select}
                  tab={tab}
                  onBack={() => setView("list")}
                  onSave={handleSave}
               />
            )}
         </Box>
      </Drawer>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*  SHARED LIST COMPONENT                                       */
/* ──────────────────────────────────────────────────────────── */
interface EntityListProps<T> {
   loading: boolean;
   items: T[];
   primary: (item: T) => string;
   secondary?: (item: T) => string;
   avatarSrc?: (item: T) => string | undefined;
   onSelect: (item: T) => void;
   onDelete: (item: T) => void;
}

function EntityList<T>({
   loading,
   items,
   primary,
   secondary,
   avatarSrc,
   onSelect,
   onDelete,
}: EntityListProps<T>) {
   if (loading)
      return (
         <Box sx={{ py: 3, textAlign: "center" }}>
            <CircularProgress size={24} />
         </Box>
      );

   if (!items.length)
      return (
         <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 3, textAlign: "center" }}
         >
            没有信息。
         </Typography>
      );

   return (
      <List disablePadding>
         {items.map((item: any, idx) => (
            <Fragment key={idx}>
               <ListItem
                  button
                  onClick={() => onSelect(item)}
                  sx={{
                     borderRadius: 2,
                     "&:hover": { bgcolor: "action.hover" },
                     gap: 1,
                     px: 1,
                     py: 1,
                  }}
               >
                  {avatarSrc && avatarSrc(item) && (
                     <Box
                        component="img"
                        src={ensureDataUrl(avatarSrc(item))}
                        alt="thumb"
                        sx={{
                           width: 64,
                           height: 64,
                           objectFit: "cover",
                           borderRadius: 1,
                           flexShrink: 0,
                        }}
                     />
                  )}

                  <ListItemText
                     primary={primary(item)}
                     secondary={secondary ? secondary(item) : undefined}
                     primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                     }}
                     secondaryTypographyProps={{ fontSize: "0.85rem" }}
                  />

                  <IconButton
                     edge="end"
                     size="small"
                     onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                     }}
                  >
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </ListItem>

               {idx < items.length - 1 && <Divider component="li" />}
            </Fragment>
         ))}
      </List>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*           EDIT FORM                                          */
/* ──────────────────────────────────────────────────────────── */
interface DetailFormProps {
   item: Product | Supplier | Clients;
   tab: TabKey;
   onBack: () => void;
   onSave: (updated: any) => void;
}

function DetailForm({ item, tab, onBack, onSave }: DetailFormProps) {
   const [form, setForm] = useState<Record<string, any>>({ ...item });

   /* ---------------- helpers ---------------- */
   const ensureDataUrl = (b64: string) =>
      b64.startsWith("data:image") ? b64 : `data:image/png;base64,${b64}`;

   const getDeep = (obj: any, path: string) =>
      path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

   const setDeep = (obj: any, path: string, value: any) => {
      const parts = path.split(".");
      const last = parts.pop()!;
      const next = { ...obj };
      let cur = next;
      for (const p of parts) {
         cur[p] = { ...(cur[p] ?? {}) };
         cur = cur[p];
      }
      cur[last] = value;
      return next;
   };

   /** update state + persist immediately */
   const saveNow = (updated: Record<string, any>) => {
      setForm(updated);
      onSave(updated);
   };

   const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
      saveNow(setDeep(form, key, e.target.value));

   const handleFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const blobUrl = URL.createObjectURL(file);
      const b64 = await getBase64FromBlobUrl(blobUrl);
      URL.revokeObjectURL(blobUrl);

      saveNow({ ...form, image: ensureDataUrl(b64 ?? "") });
   };

   const adornmentsFor = (key: string) => {
      if (key === "unitPrice") {
         return {
            startAdornment: <InputAdornment position="start">¥</InputAdornment>,
         };
      }

      if (key === "packingMass.packingMassQuantity") {
         const unit = getDeep(form, "packingMass.packingMassUnit") ?? "kg";
         return {
            endAdornment: (
               <InputAdornment position="end">{unit}</InputAdornment>
            ),
         };
      }

      return undefined;
   };

   /* ---------------- meta per entity ---------------- */
   const FIELDS: Record<
      TabKey,
      { key: string; label: string; type?: string }[]
   > = {
      products: [
         { key: "productChineseName", label: "产品中文名" },
         { key: "productEnglishName", label: "产品英文名" },
         { key: "unitPrice", label: "单位价格", type: "number" },
         { key: "hsCode", label: "HS编码" },
         { key: "material", label: "材料" },
         { key: "packing", label: "包装", type: "number" },

         { key: "packingVolume.length", label: "长", type: "number" },
         { key: "packingVolume.width", label: "宽", type: "number" },
         { key: "packingVolume.height", label: "高", type: "number" },
         {
            key: "packingMass.packingMassQuantity",
            label: "包装重量",
            type: "number",
         },
      ],
      suppliers: [
         { key: "supplierName", label: "供应商名称" },
         { key: "supplierPhoneNumber", label: "电话", type: "number" },
         { key: "supplierAddress", label: "地址" },
         { key: "supplierEmail", label: "邮箱" },
      ],
      clients: [
         { key: "companyName", label: "公司全称" },
         { key: "address", label: "完整地址" },
         { key: "contactName", label: "联系人" },
         { key: "contactPhoneNumber", label: "电话号码", type: "number" },
         { key: "contactEmail", label: "电子邮件地址" },
         { key: "eoriNumber", label: "EORI 编号" },
         { key: "vatNumber", label: "VAT 增值税号" },
      ],
   };

   const dimensionKeys = [
      "packingVolume.length",
      "packingVolume.width",
      "packingVolume.height",
   ];

   return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
         <IconButton
            onClick={onBack}
            size="small"
            sx={{
               position: "fixed",
               height: 35,
               width: 35,
               m: 1.5,
               zIndex: 1000,
            }}
         >
            <ArrowLeft />
         </IconButton>

         {form.image && (
            <Box sx={{ position: "relative", width: "100%", mb: 1 }}>
               <Box
                  component="img"
                  src={ensureDataUrl(form.image)}
                  alt="preview"
                  sx={{ width: "100%", borderRadius: 3 }}
               />

               <Button
                  variant="contained"
                  size="small"
                  component="label"
                  color="info"
                  sx={{ position: "absolute", bottom: 12, right: 8 }}
               >
                  更换图片
                  <input
                     type="file"
                     accept="image/*"
                     hidden
                     onChange={handleFile}
                  />
               </Button>
            </Box>
         )}

         <Box mt={tab !== "products" ? 8 : 2}>
            {FIELDS[tab]
               .filter(({ key }) => !dimensionKeys.includes(key))
               .map(({ key, label, type }) => (
                  <TextField
                     key={key}
                     label={label}
                     type={type ?? "text"}
                     value={getDeep(form, key) ?? ""}
                     onChange={handleChange(key)}
                     fullWidth
                     margin="normal"
                     size="small"
                     InputProps={adornmentsFor(key)}
                  />
               ))}

            <Stack
               direction={"row"}
               sx={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
               }}
               gap={1.5}
            >
               {tab === "products" && (
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                     {[
                        { key: "packingVolume.length", label: "长" },
                        { key: "packingVolume.width", label: "宽" },
                        { key: "packingVolume.height", label: "高" },
                     ].map(({ key, label }) => (
                        <Grid item xs={4} key={key}>
                           <TextField
                              label={label}
                              type="number"
                              value={getDeep(form, key) ?? ""}
                              onChange={handleChange(key)}
                              fullWidth
                              size="small"
                           />
                        </Grid>
                     ))}
                  </Grid>
               )}
               <p>{getDeep(form, "packingVolume.packingUnit")}</p>
            </Stack>
         </Box>
      </Box>
   );
}

function ensureDataUrl(str?: string) {
   if (!str) return "";
   return str.startsWith("data:image") ? str : `data:image/png;base64,${str}`;
}
