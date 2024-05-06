import Layout from "../ui/Layout.jsx";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";

function Todo() {
    let location = useLocation();
    useEffect(() => {
        // Receive account logged on successfully notification
        if (location.state !== null) {
            notifications.show({
                title: "Info",
                message: location.state,
                color: "blue"
            });
        }
    }, [location]);
    return (
        <Layout>
            <p>Todo Component</p>
        </Layout>
    );
}

export default Todo;