import {Button, Container, Group, Title, Text} from "@mantine/core";
import classes from "./NotFound.module.css";
import EmptyContent from "./EmptyContent.jsx";

function NotFoundContent() {
    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>No such content found.</Title>
        </Container>
    );
}

export default NotFoundContent;