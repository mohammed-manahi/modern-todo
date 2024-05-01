import Layout from "../ui/Layout.jsx";
import HomeContent from "../ui/HomeContent.jsx";
import {useLocation} from "react-router-dom";
import {showNotification} from "../utilities/notificationSystem.js";

function Home() {
    let location = useLocation();
    if (location.state !== null) {
        showNotification("Info", location.state, "blue")
    }
    return (
        <Layout>
            <HomeContent/>
        </Layout>
    );
}

export default Home;