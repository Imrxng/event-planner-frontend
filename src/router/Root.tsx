import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/footer";

const Root = () => {
    return (
        <>
            <div >Header</div>
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