import React from "react";
import {
   Box,
   Card,
   CardContent,
   CardHeader,
   Paper,
   Stack,
   Typography,
   useTheme,
   NoSsr,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Icon1 from "../../../assets/icons/SVG image 3.svg";
import Icon2 from "../../../assets/icons/SVG image 2.svg";
import Icon3 from "../../../assets/icons/SVG image.svg";
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
      <Box
         sx={{ bgcolor: theme.palette.background.default, borderRadius: 5, }}
         className="dashboard-card-display"
      >
         <Card
            sx={{
               p: 1.5,
               borderRadius: 4,
               boxShadow:
                  theme.palette.mode === "dark"
                     ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                     : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
         >
            <CardHeader title="今日统计" />
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
                              src={Icon1}
                              alt="图表图标"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              产品
                           </Typography>
                           <Typography variant="h5">
                              {new Intl.NumberFormat("en-US").format(200)}
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
                              src={Icon2}
                              alt="折扣图标"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              销售额
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
                              src={Icon3}
                              alt="对号图标"
                              sx={{ height: "auto", width: "100%" }}
                           />
                        </Box>
                        <div>
                           <Typography color="text.secondary" variant="body2">
                              利润
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
         name: "新客户",
         dataKey: "v1",
         fill: theme.palette.error.main,
      },
      {
         name: "增销与交叉销售",
         dataKey: "v2",
         fill: theme.palette.warning.main,
      },
   ];
}

const data = [
   { name: "一月", v1: 31, v2: 11 },
   { name: "二月", v1: 40, v2: 32 },
   { name: "三月", v1: 28, v2: 45 },
   { name: "四月", v1: 51, v2: 32 },
   { name: "五月", v1: 42, v2: 34 },
   { name: "六月", v1: 109, v2: 52 },
   { name: "七月", v1: 100, v2: 41 },
   { name: "八月", v1: 120, v2: 80 },
   { name: "九月", v1: 80, v2: 96 },
   { name: "十月", v1: 42, v2: 140 },
   { name: "十一月", v1: 90, v2: 30 },
   { name: "十二月", v1: 140, v2: 100 },
];

export function Chart1() {
   const theme = useTheme();
   const chartHeight = 240;
   const areas = getAreas(theme);

   return (
      <Box
         sx={{ bgcolor: theme.palette.background.default }}
         className="dashboard-card-display"
      >
         <Card
            sx={{
               borderRadius: 4,
               p: 1.5,
               boxShadow:
                  theme.palette.mode === "dark"
                     ? "0 2px 8px rgba(0, 0, 0, 0.5)"
                     : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
         >
            <CardHeader title="销售收入" />
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

