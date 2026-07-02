// import { url } from "@/globals";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_MODE === "development"
  ? import.meta.env.VITE_DEV_URL
  : import.meta.env.VITE_PROD_URL;

function getUsername(): string | null {
    if (typeof window === "undefined") return null;
    const uni = localStorage.getItem("uni");
    return uni;
}
export type Role = "admin" | "customer";
// Type guard function to check if an object is a Role
function isRole(str: string | null): str is Role {
    return !!str && typeof str === "string";
}
function getRole(): Role | null {
    if (typeof window === "undefined") return null;
    const role = localStorage.getItem("role");
    if (isRole(role)) {
        return role;
    }
    return null;
}

function getId(): string | null {
    if (typeof window === "undefined") return null;
    const id = localStorage.getItem("id");
    return id;
}

async function tokenValid(): Promise<boolean> {
    const sessionUrl = new URL(BASE_URL);
    sessionUrl.pathname = "auth/session";

    // const response = await fetch(sessionUrl, {
    //     method: "GET",
    //     credentials: "include",
    // });
    await axios.get(`${BASE_URL}/auth/session`)
                .then(result => {
                    console.log("Checked if token is valid, got: ", result);
                    if(result.status !== 401){
                        return {isTokenValid: true, session: result.data.data.session};
                    }
                })
                .catch(error => {
                    return {isTokenValid: false, session: null};
                })
}
function loggedIn(): boolean {
    return !!getRole() && !!getId();
}

function isUser(role: Role): boolean {
    return role.toUpperCase() === "CUSTOMER";
}
function isAdmin(role: Role): boolean {
    return role.toUpperCase() === "ADMIN";
}

export { getUsername, getRole, getId, tokenValid, loggedIn, isUser, isAdmin };