import * as React from "react";
import {
   Card,
   CardContent,
   CardHeader,
   FormControlLabel,
   Radio,
   RadioGroup,
   Stack,
   Typography,
} from "@mui/material";
import { Moon as MoonIcon, Sun as SunIcon } from "phosphor-react";

export function ThemeSwitch({isDark}: any) {
   return (
      <Card
         sx={{
            borderRadius: 4,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            p: 1.6,
            bgcolor: isDark ? "#1d1c1f" : "#faf8f5",
         }}
      >
         <CardHeader
            title={
               <Typography
                  variant="h6"
                  sx={{
                     fontSize: { xs: "1.6rem", sm: "2rem" },
                     fontWeight: 600,
                     paddingBottom: 0,
                  }}
               >
                  主题选项
               </Typography>
            }
         />
         <CardContent sx={{ p: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 4 }}>
               <RadioGroup
                  defaultValue="light"
                  sx={{
                     gap: 0,
                     bgcolor: isDark ? "#1d1c1f" : "#f0eee6",
                     "& .MuiFormControlLabel-root": {
                        justifyContent: "space-between",
                        p: 3,
                        "&:not(:last-of-type)": {
                           borderBottom: "1px solid var(--mui-palette-divider)",
                        },
                     },
                  }}
               >
                  {[
                     {
                        title: "亮色模式",
                        description: "适用于明亮环境",
                        value: "light",
                        icon: SunIcon,
                     },
                     {
                        title: "暗色模式",
                        description: "推荐在暗环境下使用",
                        value: "dark",
                        icon: MoonIcon,
                     },
                     {
                        title: "系统默认",
                        description: "自动适应设备主题",
                        value: "system",
                        icon: SunIcon,
                     },
                  ].map((option) => (
                     <FormControlLabel
                        control={<Radio />}
                        key={option.value}
                        label={
                           <Stack
                              direction="row"
                              spacing={2}
                              sx={{ alignItems: "center" }}
                           >
                              <option.icon fontSize="var(--Icon-fontSize)" />
                              <div>
                                 <Typography variant="inherit">
                                    {option.title}
                                 </Typography>
                                 <Typography
                                    color="text.secondary"
                                    variant="caption"
                                 >
                                    {option.description}
                                 </Typography>
                              </div>
                           </Stack>
                        }
                        labelPlacement="start"
                        value={option.value}
                     />
                  ))}
               </RadioGroup>
            </Card>
         </CardContent>
      </Card>
   );
}
