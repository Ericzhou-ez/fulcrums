import React, {
   createContext,
   useContext,
   useMemo,
   useState,
   ReactNode,
   useEffect,
   useCallback,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface UIStateContextProps {
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

   const [userNavOpenPreference, setUserNavOpenPreference] = useState<boolean>(
      () => {
         const savedPreference = localStorage.getItem("nav-open-preference");
         return savedPreference !== null ? JSON.parse(savedPreference) : true;
      }
   );

   const [navOpen, setNavOpenState] = useState<boolean>(() => {
      const savedPreference = localStorage.getItem("nav-open-preference");
      const initialUserPreference =
         savedPreference !== null ? JSON.parse(savedPreference) : true;

      return isMdUp ? initialUserPreference : false;
   });

   const [overlay, setOverlay] = useState<boolean>(!isMdUp);
   const [navStyle, setNavStyle] = useState<
      "blend-in" | "evident" | "discrete"
   >(() => {
      const saved = localStorage.getItem("nav-style");
      return saved === "blend-in" || saved === "evident" || saved === "discrete"
         ? saved
         : "blend-in";
   });

   useEffect(() => {
      localStorage.setItem(
         "nav-open-preference",
         JSON.stringify(userNavOpenPreference)
      );
   }, [userNavOpenPreference]);

   useEffect(() => {
      if (isMdUp) {
         setNavOpenState(userNavOpenPreference);
         setOverlay(false); 
      } else {
         setNavOpenState(false);
         setOverlay(false);
      }
   }, [isMdUp, userNavOpenPreference]);

   const setNavOpen: React.Dispatch<React.SetStateAction<boolean>> =
      useCallback(
         (newStateOrUpdater) => {
            const newNavOpen =
               typeof newStateOrUpdater === "function"
                  ? newStateOrUpdater(navOpen)
                  : newStateOrUpdater;

            setNavOpenState(newNavOpen); 

            if (isMdUp) {
               setUserNavOpenPreference(newNavOpen);
            }
         },
         [isMdUp, navOpen]
      );

   const closeOverlay = useCallback(() => {
      setOverlay(false);
      setNavOpen(false);
   }, [setNavOpen]);

   const mainContentStyles = useCallback(
      (isOpen: boolean) => ({
         marginLeft: {
            xs: 0,
            md: isOpen ? "240px" : "0px",
         },
         transition: "margin-left 0.3s ease",
         padding: 2,
      }),
      []
   ); 

   const value = useMemo(
      () => ({
         navOpen,
         setNavOpen, 
         overlay,
         setOverlay,
         closeOverlay,
         mainContentStyles,
         navStyle,
         setNavStyle,
      }),
      [navOpen, setNavOpen, overlay, closeOverlay, mainContentStyles, navStyle]
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
