import Layout from "../ui/Layout.jsx";
import {useLocation} from "react-router-dom";
import AccountLogin from "../features/account/AccountLogin.jsx";
import {notifications} from "@mantine/notifications";

function Login() {
    let location = useLocation();
    if (location.state !== null) {
        notifications.show({
            title: "Info",
            message: location.state,
            color: "blue"
        });
    }
    return (
        <Layout>
            <AccountLogin/>
        </Layout>
    );
}

export default Login;