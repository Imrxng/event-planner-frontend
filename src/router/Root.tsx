import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { useAuth0 } from "@auth0/auth0-react";

const Root = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    return (
        <>
            <Navbar />
            <div style={{minHeight: '50vh'}}>
                <Outlet />
            </div>
            {isLoading && !isAuthenticated && <FullscreenLoader content='Logging in...' />}
            <Footer />
        </>
    );
}

export default Root;