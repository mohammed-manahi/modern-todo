import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from "@mantine/core";
import classes from "./AuthenticationForm.module.css";
import {NavLink} from "react-router-dom";

function AuthenticationForm({submitActionName = "Login"}) {
    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                {submitActionName === "Login" ? "Welcome back!" : "Welcome"}
            </Title>
            {submitActionName === "Login" ?
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <NavLink to="/register">
                        Create account
                    </NavLink>
                </Text> :
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have an account?{' '}
                    <NavLink to="/login">
                        Login
                    </NavLink>
                </Text>

            }

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Email" placeholder="Example@Email.com" required/>
                <PasswordInput label="Password" placeholder="Your password" required mt="md"/>
                {submitActionName === "Login" ?
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me"/>
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    : ""}
                <Button fullWidth mt="xl">
                    {submitActionName}
                </Button>
            </Paper>
        </Container>
    );
}

export default AuthenticationForm;