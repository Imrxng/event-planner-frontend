import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import UserDataCompleter from "../components/auth/userDataCompleter";
import Footer from "../components/footer";
import { useContext } from "react";
import { UserContext } from "../context/context";

const Root = () => {
    const { inProgress } = useMsal();
    const { loadingUser } = useContext(UserContext);
    const isAuthenticated = useIsAuthenticated();
    return (
        <>
          {isAuthenticated && <UserDataCompleter />}
            <Navbar />
            <div style={{ minHeight: '50vh' }}>
                 <Outlet />
            </div>
            {inProgress === 'login' && loadingUser && <FullscreenLoader content='Logging in...' />}
            <Footer />
        </>
    );
};

export default Root;
