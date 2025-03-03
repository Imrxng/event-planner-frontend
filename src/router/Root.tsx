import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const Root = () => {
    return (
        <>
        <Navbar/>
            <div >
                <NavLink to="/" >Home</NavLink>
            </div>
            <div >
                <Outlet/>
            </div>
            <Footer/>
        </>
    );
}

export default Root;