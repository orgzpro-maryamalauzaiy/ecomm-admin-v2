import { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useNavigate } from "react-router";

export default function SignIn({user}) {
  // const [cookies, setCookies]
  const navigate = useNavigate()
  
  useEffect(() => {
    if(user){
      console.log('token from sign in', user)
      navigate('/')
    }
  }, [user])
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
