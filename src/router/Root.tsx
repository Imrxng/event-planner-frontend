import { Outlet } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { useMsal } from '@azure/msal-react';

const Root = () => {
    const { inProgress } = useMsal();

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '50vh' }}>
                <Outlet />
            </div>
            {inProgress === 'login' && <FullscreenLoader content='Logging in...' />}
            <Footer />
        </>
    );
};

export default Root;
