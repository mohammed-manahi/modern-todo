import {AppShell} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './Layout.module.css';
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import {Notifications} from "@mantine/notifications";

function Layout({children}) {
    const [opened, {toggle}] = useDisclosure();
    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
            footer={{height: 150}}
            padding="md">
            <Header opened={opened} toggle={toggle}/>
            <Navbar/>
            <AppShell.Main>
                {children}
            </AppShell.Main>
           <Footer/>
        </AppShell>
    );
}

export default Layout;