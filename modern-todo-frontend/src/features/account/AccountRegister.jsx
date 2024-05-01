import {useAccountContext, baseAccountUrl} from "./AccountContext.jsx";
import {Form, useForm} from "react-hook-form";
import {Button, Container, Paper, PasswordInput, Text, TextInput, Title, Notification, Space} from "@mantine/core";
import classes from "../../ui/AuthenticationForm.module.css";
import {NavLink, useNavigate} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import Spinner from "../../ui/Spinner.jsx";
import {notifications} from "@mantine/notifications";
import AlertArea from "../../ui/AlertArea.jsx";


// Validation schema using yup
let schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

function AccountRegister() {
    const {errors: responseErrors, dispatch, isLoading} = useAccountContext();
    const {handleSubmit, register, formState, control} = useForm({
        resolver: yupResolver(schema),
    });
    const {errors} = formState;
    const navigate = useNavigate();

    async function onRegisterAccount(data) {
        try {
            dispatch({type: "account/loading", payload: true});
            const response = await fetch(`${baseAccountUrl}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
            dispatch({type: "account/loading", payload: false});
            if (response.ok) {
                // Dispatch user email and password to reducer action
                dispatch({
                    type: "account/register",
                    payload: {email: data.email, password: data.password, confirmPassword: data.confirmPassword},
                });
                // Navigate to home
                navigate("/");
            } else {
                const errorData = await response.json();
                const errorMessages = Object.values(errorData.errors).flatMap(errorArray => errorArray);
                dispatch({type: "account/error", payload: errorMessages});
                showNotification(errorMessages);
            }
        } catch (error) {
            dispatch({type: "account/error", payload: error});
            dispatch({type: "account/loading", payload: false});
        }
    }

    function showNotification(errorMessages) {
        if (!isLoading) {
            errorMessages.forEach(errorMessage =>
                notifications.show({
                    title: "Registration Error",
                    message: errorMessage,
                    color: "red",
                })
            );
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Already have an account?{' '}
                <NavLink to="/login">
                    Login
                </NavLink>
            </Text>

            {isLoading && <Spinner/>}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Form onSubmit={handleSubmit(onRegisterAccount)} control={control}>
                    <TextInput id="email" name="email" label="Email" placeholder="Example@Email.com"
                               required {...register('email')}/>
                    {errors?.email?.message}
                    <PasswordInput id="password" name="password" label="Password" placeholder="Your password" required
                                   mt="md" {...register('password')}/>
                    {errors?.password?.message}
                    <PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password"
                                   placeholder="Your password" required
                                   mt="md" {...register('confirmPassword')}/>
                    {errors?.confirmPassword?.message}

                    <Button fullWidth mt="xl" type={"submit"} disabled={isLoading}>
                        Register
                    </Button>
                </Form>
            </Paper>
        </Container>

    );

}

export default AccountRegister;