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
            padding: 2,
            boxShadow: "0 4px 17px rgba(0, 0, 0, 0.1)",
            bgcolor: isDark ? "#111111" : "#fef6ed",
         }}
      >
         <CardContent>
            <Typography
               variant="h6"
               color="text.secondary"
               fontSize="0.94rem"
               gutterBottom
               fontWeight={400}
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
                        color: "#FF964F !important",
                        fontWeight: "600 !important",
                        fontSize: "1.1rem !important",
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
