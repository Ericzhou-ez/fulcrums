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

interface SignInPageProps {
   theme: any;
   handleToggleTheme: () => void;
   user: any;
   signedIn: boolean;
   handleSignOut: () => void;
   isModalOpen: boolean;
   toggleModal: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({
   theme,
   handleToggleTheme,
   user,
   signedIn,
   handleSignOut,
   isModalOpen,
   toggleModal,
}) => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isUserSigningUp, setIsUserSigningUp] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [isSendingEmail, setIsSendingEmail] = useState(false);
   const [footerHeight, setFooterHeight] = useState(0);
   const imgRef = useRef<HTMLImageElement | null>(null);
   const isDark = theme.palette.mode === "dark";

   useEffect(() => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
         const storedEmail = window.localStorage.getItem("emailForSignUp");

         if (storedEmail) {
            completeSignUp(storedEmail);
         } else {
            setErrorMessage("邮箱验证失败，请重新注册。");
         }
      }
   }, []);

   async function handleSendSignUpEmail() {
      try {
         setErrorMessage("");
         setSuccessMessage("");
         setIsSendingEmail(true);

         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址。");
         }

         await sendSignInLinkToEmail(auth, email, actionCodeSettings);
         window.localStorage.setItem("emailForSignUp", email);

         setSuccessMessage("请检查您的邮箱并点击链接以完成注册。");
      } catch (error) {
         setErrorMessage(
            error instanceof Error ? error.message : "无法发送邮件。"
         );
      }
   }

   async function completeSignUp(storedEmail: string) {
      try {
         setErrorMessage("");
         setSuccessMessage("正在验证您的邮箱...");

         const userCredential = await signInWithEmailLink(
            auth,
            storedEmail,
            window.location.href
         );
         await createUserWithEmailAndPassword(auth, storedEmail, password);
         setSuccessMessage("账户创建成功！");

         window.localStorage.removeItem("emailForSignUp");
      } catch (error) {
         setErrorMessage(error instanceof Error ? error.message : "注册失败。");
      }
   }

   async function handleSignIn() {
      try {
         setErrorMessage("");
         setSuccessMessage("");

         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址。");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符。");
         }

         await signInWithEmailAndPassword(auth, email, password);
         setSuccessMessage("用户登录成功！");
      } catch (err) {
         setErrorMessage(
            err instanceof Error ? err.message : "发生了意外错误。"
         );
      }
   }

   async function handleGoogleSignIn() {
      try {
         await signInWithPopup(auth, googleAuth);
      } catch (err) {
         setErrorMessage("无法使用 Google 登录。");
      }
   }

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
               user={user}
               signedIn={signedIn}
               handleSignOut={handleSignOut}
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
                     isUserSigningUp ? handleSendSignUpEmail() : handleSignIn();
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

               <button className="google-signin" onClick={handleGoogleSignIn}>
                  使用 Google 继续
               </button>
            </div>

            <div style={{ padding: "0 16px" }}>
               <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
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
