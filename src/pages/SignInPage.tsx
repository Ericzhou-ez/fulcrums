import React, { useState, useEffect, useRef } from "react";
import { auth, googleAuth, actionCodeSettings } from "../configs/firebase";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   sendSignInLinkToEmail,
   isSignInWithEmailLink,
   signInWithEmailLink,
} from "firebase/auth";
import "../styles/authentication.css";
import Footer from "../components/core/footer";
import Nav from "../components/core/nav";
import { Typography } from "@mui/material";
import FooterName from "../assets/images/footerName.svg";
import { useAuth } from "../contexts/authContexts";
import { useUserServices } from "../contexts/userServices";
import { useThemeContext } from "../contexts/themeContextProvider";

interface SignInPageProps {
   isModalOpen: boolean;
   toggleModal: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({
   isModalOpen,
   toggleModal,
}) => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isUserSigningUp, setIsUserSigningUp] = useState(false);
   const [isSendingEmail, setIsSendingEmail] = useState(false);
   const [footerHeight, setFooterHeight] = useState(0);
   const imgRef = useRef<HTMLImageElement | null>(null);
   const { isDark } = useThemeContext();
   const {
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      successMessage,
      errorMessage,
   } = useUserServices();

   return (
      <React.Fragment>
         <div
            style={{
               position: "relative",
               zIndex: 10,
               marginBottom: `${footerHeight}px`,
               backgroundColor: "var(--background-color)",
            }}
         >
            <Nav
               isModalOpen={isModalOpen}
               toggleModal={toggleModal}
               home={true}
               navOpen={false}
               setNavOpen={null}
               overlay={false}
               setOverlay={() => {}}
               searchBar={false}
            />

            <div className="auth">
               <Typography
                  variant="h1"
                  sx={{
                     fontWeight: "600",
                     fontSize: {
                        xs: "2.8rem",
                        sm: "3rem",
                        md: "3.5rem",
                        lg: "4rem",
                     },
                     textAlign: "center",
                     marginBottom: "50px",
                  }}
               >
                  {isUserSigningUp ? "创建账户" : "欢迎回来"}
               </Typography>

               <div className="email-signin-input">
                  <label>邮箱</label>
                  <input
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div className="password-signin-input">
                  <label>密码</label>
                  <input
                     type="password"
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               {errorMessage && <p className="error-message">{errorMessage}</p>}
               {successMessage && (
                  <p className="success-message">{successMessage}</p>
               )}

               <button
                  className="signin-btn"
                  onClick={() => {
                     isUserSigningUp
                        ? signUpWithEmail(email, password)
                        : signInWithEmail(email, password);
                  }}
                  disabled={isSendingEmail}
                  style={{
                     backgroundColor: isSendingEmail ? "#ccc" : "",
                     cursor: isSendingEmail ? "not-allowed" : "pointer",
                  }}
               >
                  {isUserSigningUp
                     ? isSendingEmail
                        ? "请确认注册"
                        : "注册"
                     : "登录"}
               </button>

               <p>
                  {isUserSigningUp ? "已经有账号了？" : "还没有账号？"}
                  <strong>
                     <span
                        onClick={() => {
                           setIsUserSigningUp(!isUserSigningUp);
                           setIsSendingEmail(false);
                        }}
                        style={{
                           cursor: "pointer",
                           textDecoration: "underline",
                        }}
                     >
                        {isUserSigningUp ? "登录" : "注册"}
                     </span>
                  </strong>
               </p>

               <button className="google-signin" onClick={signInWithGoogle}>
                  使用Google继续
               </button>
            </div>

            <div style={{ padding: "0 16px" }}>
               <Footer />
            </div>
         </div>
         <div
            style={{
               width: "100%",
               height: `${footerHeight}px`,
               position: "fixed",
               bottom: 0,
               zIndex: 0,
               overflow: "hidden",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: isDark ? "#380e05" : "#fff2d8",
            }}
         >
            <img
               ref={imgRef}
               src={FooterName}
               alt="Fulcrums"
               className="footer-bold-name"
               style={{
                  width: "100%",
                  objectFit: "cover",
               }}
               onLoad={() => {
                  if (imgRef.current) {
                     setFooterHeight(imgRef.current.clientHeight);
                  }
               }}
            />
         </div>
      </React.Fragment>
   );
};

export default SignInPage;
