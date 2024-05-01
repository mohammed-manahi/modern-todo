import Layout from "../ui/Layout.jsx";
import {useLocation} from "react-router-dom";
import {showNotification} from "../utilities/notificationSystem.js";
import AccountLogin from "../features/account/AccountLogin.jsx";

function Login() {
    let location = useLocation();
    if (location.state !== null){
        showNotification("Info", location.state, "blue")
    }
    return (
        <Layout>
            <AccountLogin/>
        </Layout>
    );
}

export default Login;