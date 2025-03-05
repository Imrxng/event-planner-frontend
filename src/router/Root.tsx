import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

const Root = () => {
    return (
        <>
        <Navbar/>
            <div >
                <Outlet/>
            </div>
            <Footer/>
        </>
    );
}

export default Root;