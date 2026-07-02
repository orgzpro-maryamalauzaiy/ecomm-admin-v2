import { createContext, useContext, useState, useEffect } from "react";
import { tokenValid } from "../utils/credentials";

type User = {
  email: "",
  full_name: "",
  uni: "",
  avatar: "",
  is_admin: false
}

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  // isMobileOpen: boolean;
  // isHovered: boolean;
  // activeItem: string | null;
  // openSubmenu: string | null;
  // toggleAuth: () => void;
  // toggleMobileAuth: () => void;
  // setIsHovered: (isHovered: boolean) => void;
  // setActiveItem: (item: string | null) => void;
  // toggleSubmenu: (item: string) => void;
};

// const initialAuth = await tokenValid()

const initialAuth = {
  user: {
    email: 'sample@gmail.com',
    is_admin: true
  },

}

const AuthContext = createContext(initialAuth);
{/* <AuthContextType | undefined> */}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState("")
  // const [isExpanded, setIsExpanded] = useState(true);
  // const [isMobileOpen, setIsMobileOpen] = useState(false);
  // const [isMobile, setIsMobile] = useState(false);
  // const [isHovered, setIsHovered] = useState(false);
  // const [activeItem, setActiveItem] = useState<string | null>(null);
  // const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {

    getUser()
    const handleResize = () => {
      // const mobile = window.innerWidth < 768;
      // setIsMobile(mobile);
      // if (!mobile) {
      //   setIsMobileOpen(false);
      // }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getUser = async () => {
    const {isTokenValid, session} = await tokenValid();

    if(isTokenValid){
      setUser(session)
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
        // isMobileOpen,
        // isHovered,
        // activeItem,
        // openSubmenu,
        // toggleAuth,
        // toggleMobileAuth,
        // setIsHovered,
        // setActiveItem,
        // toggleSubmenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
