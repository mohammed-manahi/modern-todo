import Layout from "../ui/Layout.jsx";
import AuthenticationForm from "../ui/AuthenticationForm.jsx";
import {useLocation} from "react-router-dom";
import {showNotification} from "../utilities/notificationSystem.js";

function Login() {
    let location = useLocation();
    if (location.state !== null){
        showNotification("Info", location.state, "blue")
    }
    return (
        <Layout>
            <AuthenticationForm/>
        </Layout>
    );
}

export default Login;