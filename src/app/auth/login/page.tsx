import { LoginForm } from "@/app/auth/login/components/login-form";
import { login, signup } from "../actions";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm loginHandler={login} />
      </div>
    </div>
  );
}
