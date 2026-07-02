import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppNavbar from "./AppNavbar"
import { ToastContainer } from "react-toastify";

const LayoutContent: React.FC = ({user}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar user={user} />
        <Backdrop user={user} />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader user={user} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <AppNavbar/>
          <Outlet user={user} />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = ({user}) => {
  return (
    <>
      <SidebarProvider>
        <LayoutContent user={user} />
        <ToastContainer style={{zIndex: 2000}} hideProgressBar={true} />
      </SidebarProvider>
    </>

  );
};

export default AppLayout;
