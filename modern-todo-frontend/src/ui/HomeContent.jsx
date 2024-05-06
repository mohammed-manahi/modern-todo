import {Button, Container, Title, Text, Space} from "@mantine/core";
import classes from "./HomeContent.module.css";
import {NavLink} from "react-router-dom";
import AlertArea from "./AlertArea.jsx";
import {useColorScheme} from "@mantine/hooks";


function HomeContent() {
    const colorScheme = useColorScheme();
    return (
        <>
            <AlertArea title="Choose your theme" description={`Toggle your favorite theme using the icon in the nav bar.
            Your system color scheme is ${colorScheme}`}/>
            <Container className={classes.wrapper} size={1400}>
                <div className={classes.inner}>
                    <Title className={classes.title}>
                        Modern{' '}
                        <Text component="span" className={classes.highlight} inherit>
                            To Do
                        </Text>{' '}
                        Application
                    </Title>
                    <Space h="md"/>
                    <Container p={0} size={600}>
                        <Text size="lg" c="dimmed" className={classes.description}>
                            Get clarity, get control. Simple to-do lists that empower you to focus on what matters most.
                            Crush your day, effortlessly.
                        </Text>
                    </Container>
                    <div className={classes.controls}>
                        <NavLink to="/login" className={classes.navLink}>
                            Login
                        </NavLink>
                        <Space w="lg"/>
                        <NavLink to="/register" className={classes.navLink}>
                            Register
                        </NavLink>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default HomeContent;