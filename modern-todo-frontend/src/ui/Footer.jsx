import {AppShell, Center, Container, Group, Text} from "@mantine/core";
import classes from "./Layout.module.css";
import Logo from "./Logo.jsx";
import {NavLink} from "react-router-dom";

function Footer(){
    return(
        <AppShell.Footer>
            <Container className={classes.inner}>
                <Logo/>
                <Group className={classes.links}>
                    <NavLink className={classes.control} to={"/"}>Home</NavLink>
                    <NavLink className={classes.control} to={"/login"}>Login</NavLink>
                    <NavLink className={classes.control} to={"/register"}>Register</NavLink>
                </Group>
            </Container>
            <Container className={classes.afterFooter}>
                <Center>
                    <Text c="dimmed" size="sm">
                        © {new Date().getFullYear()} Mohammed Manahi.
                    </Text>
                </Center>
            </Container>
        </AppShell.Footer>
    );
}

export default Footer;