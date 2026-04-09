import RegisterView from "@/components/view/auth/Register"

const RegisterPage = ({ setToaster }: any) => {
    return (
        <>
            <RegisterView setToaster={setToaster} />
        </>
    )
}

export default RegisterPage;