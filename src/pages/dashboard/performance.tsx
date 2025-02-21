import React from "react";
import {
   Avatar,
   Box,
   Card,
   CardContent,
   CardHeader,
   Chip,
   Divider,
   LinearProgress,
   Paper,
   Stack,
   Typography,
   useTheme,
   NoSsr,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

// Phosphor icons
import { Coins as CoinsIcon } from "phosphor-react";
import { CurrencyDollar as CurrencyDollarIcon } from "phosphor-react";
import { Folder as FolderIcon } from "phosphor-react";

// Recharts
import {
   Area,
   AreaChart,
   CartesianGrid,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";

export function QuickStats10() {
   const theme = useTheme();

   return (
      <Box sx={{ bgcolor: theme.palette.background.default, borderRadius: 5 }}>
         <Card
            sx={{
               borderRadius: 4,
               boxShadow:
                  theme.palette.mode === "dark"
                     ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                     : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
         >
            <CardHeader title="Today's stats" />
            <CardContent>
               <Grid container spacing={3}>
                  <Grid md={4} xs={12}>
                     <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                           placeContent: "center",
                           alignItems: "center",
                           bgcolor: theme.palette.background.paper,
                           borderRadius: 4,
                           py: 4,
                        }}
                     >
                        <Box sx={{ flex: "0 0 auto", height: 48, width: 48 }}>
                           <Box
                              component="img"
                              src="/src/assets/icons/SVG image 3.svg"
                              alt="Chart icon"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              Sales
                           </Typography>
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US").format(5402)}
                           </Typography>
                        </div>
                     </Stack>
                  </Grid>

                  <Grid md={4} xs={12}>
                     <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                           placeContent: "center",
                           alignItems: "center",
                           bgcolor: theme.palette.background.paper,
                           borderRadius: 4,
                           py: 4,
                        }}
                     >
                        <Box sx={{ flex: "0 0 auto", height: 48, width: 48 }}>
                           <Box
                              component="img"
                              src="/src/assets/icons/SVG image 2.svg"
                              alt="Discount icon"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              Cost
                           </Typography>
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US", {
                                 style: "currency",
                                 currency: "USD",
                                 maximumFractionDigits: 0,
                              }).format(15032)}
                           </Typography>
                        </div>
                     </Stack>
                  </Grid>

                  <Grid md={4} xs={12}>
                     <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                           placeContent: "center",
                           alignItems: "center",
                           bgcolor: theme.palette.background.paper,
                           borderRadius: 4,
                           py: 4,
                        }}
                     >
                        <Box sx={{ flex: "0 0 auto", height: 48, width: 48 }}>
                           <Box
                              component="img"
                              src="/src/assets/icons/SVG image.svg"
                              alt="Tick icon"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              Profit
                           </Typography>
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US", {
                                 style: "currency",
                                 currency: "USD",
                                 maximumFractionDigits: 0,
                              }).format(25961)}
                           </Typography>
                        </div>
                     </Stack>
                  </Grid>
               </Grid>
            </CardContent>
         </Card>
      </Box>
   );
}

function getAreas(theme: any) {
   return [
      {
         name: "New customers",
         dataKey: "v1",
         fill: theme.palette.info.main,
      },
      {
         name: "Up & cross selling",
         dataKey: "v2",
         fill: theme.palette.success.main,
      },
   ];
}

const data = [
   { name: "Jan", v1: 31, v2: 11 },
   { name: "Feb", v1: 40, v2: 32 },
   { name: "Mar", v1: 28, v2: 45 },
   { name: "Apr", v1: 51, v2: 32 },
   { name: "May", v1: 42, v2: 34 },
   { name: "Jun", v1: 109, v2: 52 },
   { name: "Jul", v1: 100, v2: 41 },
   { name: "Aug", v1: 120, v2: 80 },
   { name: "Sep", v1: 80, v2: 96 },
   { name: "Oct", v1: 42, v2: 140 },
   { name: "Nov", v1: 90, v2: 30 },
   { name: "Dec", v1: 140, v2: 100 },
];

export function Chart1() {
   const theme = useTheme();
   const chartHeight = 240;
   const areas = getAreas(theme);

   return (
      <Box
         sx={{
            bgcolor: theme.palette.background.default,
         }}
      >
         <Card
            sx={{
               borderRadius: 4,
               boxShadow:
                  theme.palette.mode === "dark"
                     ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                     : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
         >
            <CardHeader title="Sales revenue" />
            <CardContent>
               <Stack spacing={3}>
                  <NoSsr fallback={<Box sx={{ height: chartHeight }} />}>
                     <ResponsiveContainer height={chartHeight} width="100%">
                        <AreaChart
                           data={data}
                           margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
                        >
                           <CartesianGrid
                              strokeDasharray="2 4"
                              vertical={false}
                           />
                           <XAxis
                              axisLine={false}
                              dataKey="name"
                              tickLine={false}
                              type="category"
                           />
                           <YAxis
                              axisLine={false}
                              domain={[0, 150]}
                              tickLine={false}
                              type="number"
                           />
                           {areas.map((area) => (
                              <Area
                                 key={area.name}
                                 name={area.name}
                                 dataKey={area.dataKey}
                                 fill={area.fill}
                                 stroke={area.fill}
                                 fillOpacity={0.3}
                                 strokeWidth={3}
                                 dot={<Dot />}
                                 animationDuration={300}
                                 type="linear"
                              />
                           ))}
                           <Tooltip
                              animationDuration={50}
                              content={<TooltipContent />}
                              cursor={false}
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </NoSsr>

                  {/* Simple Legend */}
                  <Stack
                     direction="row"
                     spacing={2}
                     sx={{ flexWrap: "wrap", justifyContent: "center" }}
                  >
                     {areas.map((area) => (
                        <Stack
                           direction="row"
                           key={area.name}
                           spacing={1}
                           sx={{ alignItems: "center" }}
                        >
                           <Box
                              sx={{
                                 bgcolor: area.fill,
                                 borderRadius: "2px",
                                 height: "4px",
                                 width: "16px",
                              }}
                           />
                           <Typography variant="body2">{area.name}</Typography>
                        </Stack>
                     ))}
                  </Stack>
               </Stack>
            </CardContent>
         </Card>
      </Box>
   );
}

interface DotProps {
   active?: boolean;
   cx?: number;
   cy?: number;
   payload?: any;
   stroke?: string;
}
function Dot({ active, cx, cy, payload, stroke }: DotProps) {
   if (active && payload?.name === active) {
      return <circle cx={cx} cy={cy} fill={stroke} r={6} />;
   }
   return null;
}

interface TooltipPayload {
   name: string;
   value: number;
   stroke: string;
}
interface TooltipState {
   active?: boolean;
   payload?: TooltipPayload[];
}
function TooltipContent({ active, payload }: TooltipState) {
   if (!active || !payload) {
      return null;
   }

   return (
      <Paper
         sx={{
            border: 4,
            borderColor: "divider",
            boxShadow: 2,
            p: 1,
         }}
      >
         <Stack spacing={2}>
            {payload.map((entry) => (
               <Stack
                  direction="row"
                  key={entry.name}
                  spacing={3}
                  sx={{ alignItems: "center" }}
               >
                  <Stack
                     direction="row"
                     spacing={1}
                     sx={{ alignItems: "center", flex: 1 }}
                  >
                     <Box
                        sx={{
                           bgcolor: entry.stroke,
                           borderRadius: "28px",
                           height: 8,
                           width: 8,
                        }}
                     />
                     <Typography sx={{ whiteSpace: "nowrap" }}>
                        {entry.name}
                     </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                     {new Intl.NumberFormat("en-US").format(entry.value)}
                  </Typography>
               </Stack>
            ))}
         </Stack>
      </Paper>
   );
}

export function QuickStats2() {
   const theme = useTheme();

   return (
      <Box sx={{ bgcolor: theme.palette.background.default }}>
         <Grid container spacing={3}>
            <Grid lg={3} md={6} xs={12}>
               <Card
                  sx={{
                     borderRadius: 4,
                     boxShadow:
                        theme.palette.mode === "dark"
                           ? "0 2px 8px rgba(0,0,0,0.5)"
                           : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
               >
                  <Stack
                     direction="row"
                     spacing={3}
                     sx={{ alignItems: "center", p: 3 }}
                  >
                     <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography color="text.secondary" variant="overline">
                           Today&apos;s money
                        </Typography>
                        <Stack
                           direction="row"
                           spacing={1}
                           sx={{ alignItems: "center" }}
                        >
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US", {
                                 style: "currency",
                                 currency: "USD",
                                 maximumFractionDigits: 0,
                              }).format(4173)}
                           </Typography>
                           <Chip color="success" label="4%" size="small" />
                        </Stack>
                     </Stack>
                     <Avatar
                        sx={{
                           bgcolor: theme.palette.primary.main,
                           color: theme.palette.primary.contrastText,
                           height: 48,
                           width: 48,
                        }}
                     >
                        <CurrencyDollarIcon size={24} />
                     </Avatar>
                  </Stack>
               </Card>
            </Grid>

            <Grid lg={3} md={6} xs={12}>
               <Card
                  sx={{
                     borderRadius: 4,
                     boxShadow:
                        theme.palette.mode === "dark"
                           ? "0 2px 8px rgba(0,0,0,0.5)"
                           : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
               >
                  <Stack
                     direction="row"
                     spacing={2}
                     sx={{ alignItems: "center", p: 3 }}
                  >
                     <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography color="text.secondary" variant="overline">
                           New projects
                        </Typography>
                        <Stack
                           direction="row"
                           spacing={1}
                           sx={{ alignItems: "center" }}
                        >
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US").format(12)}
                           </Typography>
                           <Chip color="error" label="-10%" size="small" />
                        </Stack>
                     </Stack>
                     <Avatar
                        sx={{
                           bgcolor: theme.palette.primary.main,
                           color: theme.palette.primary.contrastText,
                           height: 48,
                           width: 48,
                        }}
                     >
                        <FolderIcon size={24} />
                     </Avatar>
                  </Stack>
               </Card>
            </Grid>

            <Grid lg={3} md={6} xs={12}>
               <Card
                  sx={{
                     borderRadius: 4,
                     boxShadow:
                        theme.palette.mode === "dark"
                           ? "0 2px 8px rgba(0,0,0,0.5)"
                           : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
               >
                  <Stack spacing={1} sx={{ p: 3 }}>
                     <Typography color="text.secondary" variant="overline">
                        System Health
                     </Typography>
                     <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                     >
                        <Typography variant="h5">
                           {new Intl.NumberFormat("en-US", {
                              style: "percent",
                              maximumFractionDigits: 2,
                           }).format(0.74)}
                        </Typography>
                        <LinearProgress
                           color="primary"
                           sx={{ flex: 1 }}
                           value={74}
                           variant="determinate"
                        />
                     </Stack>
                  </Stack>
               </Card>
            </Grid>

            <Grid lg={3} md={6} xs={12}>
               <Card
                  sx={{
                     borderRadius: 4,
                     boxShadow:
                        theme.palette.mode === "dark"
                           ? "0 2px 8px rgba(0,0,0,0.5)"
                           : "0 2px 8px rgba(0,0,0,0.1)",
                     alignItems: "center",
                     display: "flex",
                     justifyContent: "space-between",
                     bgcolor: theme.palette.primary.main,
                     color: theme.palette.primary.contrastText,
                  }}
               >
                  <Stack
                     direction="row"
                     spacing={2}
                     sx={{ alignItems: "center", p: 3 }}
                  >
                     <Stack spacing={1} sx={{ flex: 1 }}>
                        <Typography color="inherit" variant="overline">
                           ROI per customer
                        </Typography>
                        <Typography color="inherit" variant="h5">
                           {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                           }).format(25.5)}
                        </Typography>
                     </Stack>
                     <Avatar
                        sx={{
                           bgcolor: theme.palette.primary.contrastText,
                           color: theme.palette.primary.main,
                           height: 48,
                           width: 48,
                        }}
                     >
                        <CoinsIcon size={24} />
                     </Avatar>
                  </Stack>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
}
