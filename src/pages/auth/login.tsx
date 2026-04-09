import LoginView from "@/components/view/auth/Login";

const Login = ({ setToaster }: any) => {
    return (
        <LoginView setToaster={setToaster} />
    )
}

export default Login;