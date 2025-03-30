import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";
import { useThemeContext } from "../../../contexts/themeContextProvider";

interface SuggestionItem {
   title: string;
   link: string;
}

interface SuggestionsProps {
   suggestions: SuggestionItem[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
   const {isDark} = useThemeContext();

   return (
      <Card
         sx={{
            my: 3,
            borderRadius: "20px",
            padding: 0.5,
            boxShadow: "0 4px 17px rgba(0, 0, 0, 0.1)",
            bgcolor: isDark ? "#111111" : "#fef6ed",
         }}
      >
         <CardContent>
            <Typography
               variant="h6"
               color="text.secondary"
               fontWeight={400}
               sx={{
                  fontSize: {
                     xs: "0.8rem !important",
                     sm: "0.9rem !important",
                  },
               }}
            >
               正在寻找其它页面？
            </Typography>

            <Stack mt={3}>
               {suggestions.map((item, index) => (
                  <Button
                     key={index}
                     variant="outlined"
                     component={RouterLink}
                     to={item.link}
                     sx={{
                        cursor: "pointer !important",
                        padding: "2.5px 0 !important",
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "#ff7800 !important",
                        fontWeight: "600 !important",
                        fontSize: {
                           xs: "0.95rem !important",
                           sm: "1.1rem !important",
                        },
                        "&:hover": { textDecoration: "underline !important" },
                     }}
                  >
                     {item.title}
                  </Button>
               ))}
            </Stack>
         </CardContent>
      </Card>
   );
};

export default Suggestions;
