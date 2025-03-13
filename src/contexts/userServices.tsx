import React, { createContext, useContext } from "react";
import { UserType } from "../types/types";
import {
   signOut,
   signInWithEmailAndPassword,
   signInWithPopup,
   createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, googleAuth, db } from "../configs/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

interface UserContextProps {
   signInWithGoogle: () => Promise<void>;
   signInWithEmail: (
      email: string,
      password: string,
      setError: any
   ) => Promise<void>;
   signUpWithEmail: (
      email: string,
      password: string,
      name: string,
      checked: boolean,
      setError: any
   ) => Promise<void>;
   logOut: () => Promise<void>;
   user: UserType | null;
   loading: boolean;
   errorMessage: string;
   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
   successMessage: string;
}

interface UserServiceProps {
   children: React.ReactNode;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   user: UserType | null;
   loading: boolean;
   errorMessage: string;
   successMessage: string;
   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
   setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserServiceProvider: React.FC<UserServiceProps> = ({
   children,
   setUser,
   user,
   setLoading,
   loading,
   errorMessage,
   setErrorMessage,
   successMessage,
   setSuccessMessage,
}) => {
   async function signInWithGoogle() {
      try {
         setLoading(true);
         const res = await signInWithPopup(auth, googleAuth);
         await setNewUserDoc(res, "");
         // if exists loaded by auth context
      } catch (err) {
         setErrorMessage("无法使用Google登录.");
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   async function signInWithEmail(
      email: string,
      password: string,
      setError: React.Dispatch<React.SetStateAction<boolean>>
   ) {
      try {
         setLoading(true);
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址.");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符.");
         }
         // only call if signing in
         await signInWithEmailAndPassword(auth, email, password);
         // auth context handles the data population
      } catch (err) {
         console.error(err);
         setErrorMessage(
            err instanceof Error ? err.message : "发生了意外错误."
         );
         setError(true);
      } finally {
         setLoading(false);
      }
   }

   async function signUpWithEmail(
      email: string,
      password: string,
      name: string,
      checked: boolean,
      setError: React.Dispatch<React.SetStateAction<boolean>>
   ) {
      try {
         setLoading(true);
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址.");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符.");
         }
         if (!name) {
            throw new Error("请输入有效的名字.");
         }
         if (!checked) {
            throw new Error("请同意隐私政策和使用条款及Cookie政策.");
         }
         setSuccessMessage("注册中，请稍等");

         // only call if signing up
         const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
         );
         // create new collection in users
         await setNewUserDoc(res, name);
      } catch (err) {
         console.error(err);
         setErrorMessage(err instanceof Error ? err.message : "注册失败");
         setError(true);
      } finally {
         setLoading(false);
      }
   }

   async function logOut() {
      try {
         setLoading(true);
         await signOut(auth);
         setUser(null);
      } catch (error) {
         console.error("Logout Error:", error);
      } finally {
         setLoading(false);
      }
   }

   async function setNewUserDoc(
      res: { user: any },
      name: string
   ): Promise<void> {
      try {
         const functions = getFunctions(undefined, "us-central1");
         const createUserDoc = httpsCallable(functions, "createUserDoc");

         console.log("creating user doc called");
         const { uid, email, displayName, photoURL } = res.user;
         await createUserDoc({uid, email, displayName, photoURL, name});
         console.log("finish call");

         setSuccessMessage("");
         setErrorMessage("");
      } catch (error) {
         console.error("Error setting user document in Firestore:", error);
         setErrorMessage("注册失败");
      }
   }

   return (
      <UserContext.Provider
         value={{
            signInWithEmail,
            signInWithGoogle,
            signUpWithEmail,
            logOut,
            user,
            loading,
            successMessage,
            errorMessage,
            setErrorMessage,
         }}
      >
         {children}
      </UserContext.Provider>
   );
};

export function useUserServices() {
   const context = useContext(UserContext);

   if (!context) {
      throw new Error(
         "useUserService must be used within an UserServiceProvider"
      );
   }

   return context;
}
