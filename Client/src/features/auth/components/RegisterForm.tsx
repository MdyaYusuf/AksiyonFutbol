import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FictionalDisclaimer } from "../../../core/components/legal/FictionalDisclaimer";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { authService } from "../authService";
import { AuthPageShell, AuthTextField } from "./AuthFormFields";

interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormState: RegisterFormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "confirmPassword" || field === "password") {
      setConfirmPasswordError(undefined);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmPasswordError(undefined);

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("Şifreler eşleşmiyor.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/login", { replace: true });
    } catch {
      /* Server validation and business errors are shown via apiClient toasts */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-headline-md font-bold text-on-surface">
            Initialize Career
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Create your managerial profile and take command.
          </p>
        </div>

        <div className="mx-auto mb-4 flex w-max items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2">
          <MaterialIcon name="stars" className="text-sm text-secondary" />
          <span className="text-label-caps text-on-surface-variant">
            Starting Legitimacy:
          </span>
          <span className="font-data-mono text-data-mono font-bold text-primary">0</span>
        </div>

        <FictionalDisclaimer compact className="mb-6 text-center" />

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <AuthTextField
            id="username"
            name="username"
            label="Kullanıcı Adı"
            icon="person"
            type="text"
            placeholder="ör. Tactician99"
            autoComplete="username"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
          />

          <AuthTextField
            id="email"
            name="email"
            label="E-posta"
            icon="mail"
            type="email"
            placeholder="manager@club.com"
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
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />

          <AuthTextField
            id="confirmPassword"
            name="confirmPassword"
            label="Şifre Tekrar"
            icon="lock_reset"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            error={confirmPasswordError}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded bg-primary-container py-3 text-headline-sm text-on-primary-container shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-colors hover:bg-primary hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MaterialIcon name="sports_score" />
              {isSubmitting ? "Kayıt oluşturuluyor..." : "Begin Your Career"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body-sm text-on-surface-variant">
            Already managing a squad?{" "}
            <Link to="/login" className="font-bold text-primary transition-all hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
};
