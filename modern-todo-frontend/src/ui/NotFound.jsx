import Layout from "../ui/Layout.jsx";
import classes from './NotFound.module.css';
import {Button, Container, Group, Title, Text} from "@mantine/core";

function NotFound() {
    return (
        <Layout>
            <Container className={classes.root}>
                <div className={classes.label}>404</div>
                <Title className={classes.title}>Resource not found</Title>
            </Container>
        </Layout>
    );
}

export default NotFound;