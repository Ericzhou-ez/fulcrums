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
import { Box, Checkbox, Typography, Link } from "@mui/material";
import FooterName from "../assets/images/footerName.svg";
import { useAuth } from "../contexts/authContexts";
import { useUserServices } from "../contexts/userServices";
import { useThemeContext } from "../contexts/themeContextProvider";
import CtaPhoto from "../assets/images/sunset_dune.svg";
import LoginBackground from "../assets/images/signin-background.svg";

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
   const [name, setName] = useState("");
   const [error, setError] = useState(false);
   const [checked, setChecked] = useState(false);
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
      setErrorMessage,
   } = useUserServices();

   return (
      <React.Fragment>
         <div className="signin-nav">
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
         </div>

         <div
            style={{
               position: "relative",
               zIndex: 10,
               marginBottom: `${footerHeight}px`,
               backgroundColor: "var(--background-color)",
            }}
         >
            <div className="signin-page-container">
               <div className="photo-signin-container">
                  <img alt="none" src={CtaPhoto} />
                  <div style={{ display: "flex", alignItems: "center" }}>
                     <a href="/">
                        <button className="home-btn">返回主页</button>
                     </a>
                     <p
                        style={{
                           fontSize: "1.6rem",
                           fontWeight: "900",
                           position: "absolute",
                           top: "0",
                           left: " 0",
                           margin: "20px",
                           color: "white",
                        }}
                     >
                        Fulcums
                     </p>
                  </div>
                  <Typography
                     sx={{
                        position: "absolute",
                        bottom: "0",
                        zIndex: "100",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: {
                           sm: "3.4rem",
                           md: "4rem",
                           lg: "4.5rem",
                        },
                        color: "white",
                     }}
                     className="signin-cta"
                  >
                     支点引<span style={{ textWrap: "nowrap" }}>领未来</span>.
                  </Typography>
               </div>

               <div className="auth">
                  <div style={{ maxWidth: "500px", width: "100%" }}>
                     <Typography
                        variant="h1"
                        sx={{
                           fontWeight: "600",
                           fontSize: {
                              xs: "2.8rem",
                              sm: "3.2rem",
                              md: "3.8rem",
                              lg: "4.2rem",
                           },
                           textAlign: "center",
                           marginBottom: "50px",
                        }}
                     >
                        {isUserSigningUp ? "创建账户" : "欢迎回来"}
                     </Typography>

                     <div className="email-signin-input">
                        <label className={error ? "error-label" : ""}>
                           邮箱
                        </label>
                        <input
                           type="email"
                           required
                           value={email}
                           onChange={(e) => {
                              setEmail(e.target.value);
                              setErrorMessage("");
                              setError(false);
                           }}
                           className={error ? "error" : ""}
                        />
                     </div>
                     <div className="password-signin-input">
                        <label className={error ? "error-label" : ""}>
                           密码
                        </label>
                        <input
                           type="password"
                           required
                           value={password}
                           onChange={(e) => {
                              setPassword(e.target.value);
                              setErrorMessage("");
                              setError(false);
                           }}
                           className={error ? "error" : ""}
                        />
                     </div>
                     {isUserSigningUp ? (
                        <React.Fragment>
                           <div className="name-input">
                              <label className={error ? "error-label" : ""}>
                                 名字
                              </label>
                              <input
                                 type="text"
                                 required
                                 value={name}
                                 onChange={(e) => {
                                    setName(e.target.value);
                                    setErrorMessage("");
                                    setError(false);
                                 }}
                                 className={error ? "error" : ""}
                              />
                           </div>
                           <div className="profile-photo-input"></div>
                           <Box display="flex" alignItems="center">
                              <Checkbox
                                 color="info"
                                 checked={checked}
                                 onChange={() => setChecked(!checked)}
                              />
                              <Typography variant="body2">
                                 我同意
                                 <p
                                    style={{
                                       display: "inline",
                                       textDecoration: "underline",
                                       cursor: "pointer",
                                       margin: 0,
                                       padding: 0,
                                    }}
                                    onClick={() =>
                                       window.open(
                                          "/privacy",
                                          "_blank",
                                          "noopener"
                                       )
                                    }
                                 >
                                    隐私政策
                                 </p>
                                 和
                                 <p
                                    style={{
                                       display: "inline",
                                       textDecoration: "underline",
                                       cursor: "pointer",
                                       margin: 0,
                                       padding: 0,
                                    }}
                                    onClick={() =>
                                       window.open(
                                          "/terms",
                                          "_blank",
                                          "noopener"
                                       )
                                    }
                                 >
                                    使用条款
                                 </p>
                                 及
                                 <p
                                    style={{
                                       display: "inline",
                                       textDecoration: "underline",
                                       cursor: "pointer",
                                       margin: 0,
                                       padding: 0,
                                    }}
                                    onClick={() =>
                                       window.open(
                                          "/cookies",
                                          "_blank",
                                          "noopener"
                                       )
                                    }
                                 >
                                    Cookie政策
                                 </p>
                                 。
                              </Typography>
                           </Box>
                        </React.Fragment>
                     ) : (
                        ""
                     )}

                     {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                     )}
                     {successMessage && (
                        <p className="success-message">{successMessage}</p>
                     )}

                     <button
                        className="signin-btn"
                        onClick={() => {
                           isUserSigningUp
                              ? signUpWithEmail(
                                   email,
                                   password,
                                   name,
                                   checked,
                                   setError
                                )
                              : signInWithEmail(email, password, setError);
                        }}
                        disabled={isSendingEmail}
                        style={{
                           backgroundColor: isSendingEmail ? "#ccc" : "",
                           cursor: "pointer",
                        }}
                     >
                        {isUserSigningUp ? "注册" : "登录"}
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

                     <button
                        className="google-signin"
                        onClick={signInWithGoogle}
                     >
                        使用Google继续
                     </button>
                  </div>
               </div>
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
