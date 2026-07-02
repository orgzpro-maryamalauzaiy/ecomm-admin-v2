import { useEffect } from 'react';
import {useAuth} from '../providers/AuthProvider'
import {useNavigate} from 'react-router-dom'
import { Outlet } from 'react-router';
import Signin from '../pages/AuthPages/SignIn'

const ProtectedRoute = ({user}) => {
  const navigate = useNavigate()

  useEffect(() => {

    console.log('user', user)

  }, [user])
  // const { token } = useAuth();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    // return <Navigate to="/signin" />;
    navigate('/admin/login')
    // return <Navigate to={"/admin/login"} replace></Navigate>
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute
// "use client";

// // import { useRouter } from "next/navigation";
// import { useNavigate } from 'react-router'
// import { useEffect, useState } from "react";
// // import { useAuth } from "@/app/context/AuthContext";
// import { useAuth } from "../context/AuthContext"
// import { tokenValid } from "../utils/credentials";

// type Props = {
//     redirectTo?: string; // Optional redirection URL
//     require: "admin" | "loggedin" | "loggedout";
//     validateToken?: boolean;
//     children: React.ReactNode;
// };

// export default function ProtectedRoute({
//     require,
//     redirectTo,
//     validateToken,
//     children,
// }: Props) {
//     const navigate = useNavigate();
//     const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null indicates "loading"
//     const { user, setUser} = useAuth()
//     // const { role, logOut, isLoggedIn } = useAuth();

//     useEffect(() => {
//         const validateAccess = async () => {
//             try {
//                 // If token needs validation, check if it's valid
//                 if (validateToken) {
//                     const {isTokenValid, session} = await tokenValid();
//                     setUser(session)
//                     // If token is invalid and user does not need to be logged out, redirect
//                     if (!isTokenValid && require !== "loggedout") {
//                         // logOut(); // Log out so the old token is not valid anymore
//                         setUser("")
//                         handleRedirect();
//                         return;
//                     }
//                     // If user has to be logged out, and user is logged in, log them out
//                     if (
//                         require === "loggedout" &&
//                         !isTokenValid &&
//                         user
//                     ) {
//                         // User has invalid token, but is logged in locally
//                         // logout();
//                         setUser("")
//                         return;
//                     }
//                 }

//                 // Check for other cases
//                 if (
//                     (require === "loggedin" && !user) ||
//                     (require === "admin" && user.is_admin !== true) || // Simplified admin check
//                     (require === "loggedout" && user) // Simplified loggedout
//                 ) {
//                     handleRedirect();
//                     return;
//                 }

//                 setIsAuthorized(true); // User is authorized
//             } catch (error) {
//                 console.error("Error during validation:", error);
//                 handleRedirect(); // Redirect on error
//             }
//         };

//         const handleRedirect = () => {
//             if (redirectTo) {
//               navigate(redirectTo)
//                 // router.push(redirectTo);
//             } else {
//                 setIsAuthorized(false); // Deny access without redirect
//             }
//         };

//         validateAccess();
//     }, [require, validateToken, redirectTo, user, setUser]);

//     if (isAuthorized === null) {
//         return null; // Hide content while loading
//     }

//     if (!isAuthorized) {
//         return null; // Hide content for unauthorized users.
//     }

//     return <>{children}</>; // Render protected content
// }
// export function ProtectedRoute ({user}) {
//   // const [user,]
// }