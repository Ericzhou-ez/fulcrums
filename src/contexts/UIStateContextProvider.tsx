import React, {
   createContext,
   useContext,
   useMemo,
   useState,
   ReactNode,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface UIStateContextProps {
   isModalOpen: boolean;
   navOpen: boolean;
   setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
   overlay: boolean;
   setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
   closeOverlay: () => void;
   mainContentStyles: (navOpen: boolean) => object;
   navStyle: string;
   setNavStyle: React.Dispatch<
      React.SetStateAction<"blend-in" | "discrete" | "evident">
   >;
}

const UIStateContext = createContext<UIStateContextProps | undefined>(
   undefined
);

interface UIStateContextProviderProps {
   children: ReactNode;
}

export const UIStateContextProvider: React.FC<UIStateContextProviderProps> = ({
   children,
}) => {
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [navOpen, setNavOpen] = useState<boolean>(isMdUp);
   const [overlay, setOverlay] = useState<boolean>(!isMdUp);
   const [navStyle, setNavStyle] = useState<
      "blend-in" | "evident" | "discrete"
   >(() => {
      const saved = localStorage.getItem("nav-style");
      return saved === "blend-in" || saved === "evident" || saved === "discrete"
         ? saved
         : "blend-in";
   });

   const closeOverlay = () => {
      setOverlay(false);
      setNavOpen(false);
   };

   const mainContentStyles = (navOpen: boolean) => ({
      marginLeft: {
         xs: 0,
         md: navOpen ? "240px" : "0px",
      },
      transition: "margin-left 0.3s ease",
      padding: 2,
   });

   const value = useMemo(
      () => ({
         isModalOpen,
         navOpen,
         setNavOpen,
         overlay,
         setOverlay,
         closeOverlay,
         mainContentStyles,
         navStyle,
         setNavStyle,
      }),
      [isModalOpen, navOpen, overlay, mainContentStyles, navStyle]
   );

   return (
      <UIStateContext.Provider value={value}>
         {children}
      </UIStateContext.Provider>
   );
};

export const useUIStateContext = (): UIStateContextProps => {
   const context = useContext(UIStateContext);
   if (!context) {
      throw new Error(
         "useUIStateContext must be used within a UIStateContextProvider"
      );
   }
   return context;
};
