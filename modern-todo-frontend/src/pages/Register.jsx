import Layout from "../ui/Layout.jsx";
import AuthenticationForm from "../ui/AuthenticationForm.jsx";

function Register() {
    return (
        <Layout>
            <AuthenticationForm submitActionName={"Register"} />
        </Layout>
    );
}

export default Register;