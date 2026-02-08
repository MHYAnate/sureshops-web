import { Metadata } from "next";
import { LoginForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
}