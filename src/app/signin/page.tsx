import { Metadata } from "next";
import SigninForm from "@/components/signin";

export const metadata: Metadata = {
  title: "Sign In Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign In Page for Startup Nextjs Template",
  // other metadata
};

const SigninPage = () => {
  return (
    <SigninForm/>
  );
};

export default SigninPage;
