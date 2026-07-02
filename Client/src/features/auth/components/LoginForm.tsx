import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../core/store/hooks";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { authService } from "../authService";
import { setCredentials } from "../authSlice";
import { AuthTextField } from "./AuthFormFields";

interface LoginFormState {
  email: string;
  password: string;
}

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>(initialFormState);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof LoginFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authService.login({
        email: form.email.trim(),
        password: form.password,
      });

      if (response.success && response.data) {
        dispatch(setCredentials(response.data));
        navigate("/app", { replace: true });
      }
    } catch {
      /* Server validation and auth errors are shown via apiClient toasts */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-grow items-center justify-center overflow-hidden p-6">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high p-8 shadow-lg">
        <div className="absolute top-0 left-0 h-1 w-full bg-primary" />

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-headline-md font-bold text-on-surface">Manager Access</h1>
          <p className="text-body-sm text-on-surface-variant">
            Authenticate to access team data and tactical systems.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <AuthTextField
            id="email"
            name="email"
            label="E-posta"
            icon="mail"
            type="email"
            placeholder="manager@aksiyonfutbol.com"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />

          <AuthTextField
            id="password"
            name="password"
            label="Şifre"
            icon="lock"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(event) => setRememberDevice(event.target.checked)}
                className="rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-body-sm text-on-surface-variant">Remember device</span>
            </label>
            <a
              href="#"
              className="text-body-sm text-primary transition-colors hover:text-primary-fixed"
              onClick={(event) => event.preventDefault()}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-primary-container py-3 text-label-caps text-on-primary-container transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Giriş yapılıyor..." : "Enter Headquarters"}
            <MaterialIcon name="login" className="text-[18px]" />
          </button>
        </form>

        <div className="mt-8 border-t border-outline-variant pt-6 text-center">
          <p className="text-body-sm text-on-surface-variant">
            No active contract?{" "}
            <Link to="/register" className="text-primary transition-colors hover:text-primary-fixed">
              Register New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
