import {useAccountContext} from "./AccountContext.jsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

function ProtectedRoute({children}) {
    // Redirect user to login page if not authenticated
    const {isAuthenticated} = useAccountContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return children || <Outlet/>;
}

export default ProtectedRoute;