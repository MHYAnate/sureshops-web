import { Metadata } from "next";
import { RegisterForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p className="text-muted-foreground mt-1">
          Join SureShops to discover amazing deals
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}