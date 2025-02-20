import React, { useState } from "react";
import { auth, googleAuth } from "../configs/firebase";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
} from "firebase/auth";
import "../styles/authentication.css";
import Footer from "../components/core/footer";
import Nav from "../components/core/nav";
import { Typography } from "@mui/material";

interface SignInPageProps {
   theme: "light" | "dark";
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

   async function handleAuthAction() {
      try {
         setErrorMessage("");

         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址。");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符。");
         }

         if (isUserSigningUp) {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("用户注册成功！");
         } else {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("用户登录成功！");
         }
      } catch (err: unknown) {
         if (err instanceof Error) {
            setErrorMessage(err.message);
         } else {
            setErrorMessage("发生了意外错误。");
         }
      }
   }

   async function handleGoogleSignIn() {
      try {
         await signInWithPopup(auth, googleAuth);
      } catch (err) {
         console.error(err);
      }
   }

   return (
      <React.Fragment>
         <Nav
            user={user}
            signedIn={signedIn}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            home={true}
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

            <button className="signin-btn" onClick={handleAuthAction}>
               {isUserSigningUp ? "注册" : "登录"}
            </button>

            <p>
               {isUserSigningUp ? "已经有账号了？" : "还没有账号？"}
               <strong>
                  <span
                     onClick={() => setIsUserSigningUp(!isUserSigningUp)}
                     style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                     {isUserSigningUp ? "登录" : "注册"}
                  </span>
               </strong>
            </p>

            <button className="google-signin" onClick={handleGoogleSignIn}>
               使用 Google 继续
            </button>
         </div>

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </React.Fragment>
   );
};

export default SignInPage;
