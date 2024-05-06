import Layout from "../ui/Layout.jsx";
import HomeContent from "../ui/HomeContent.jsx";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";

function Home() {
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
            <HomeContent/>
        </Layout>
    );
}

export default Home;