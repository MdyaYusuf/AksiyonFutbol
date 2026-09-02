import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { setCredentials } from "@/features/auth/authSlice";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/features/users/usersApiSlice";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const isPasswordStrongEnough = (password: string) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

export const AccountSettingsPage = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: me, isLoading: isMeLoading, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: isSavingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputId = useId();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);

  const user = me ?? authUser;

  useEffect(() => {
    if (!user) return;
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const passwordsMismatch =
    confirmTouched &&
    confirmNewPassword.length > 0 &&
    newPassword !== confirmNewPassword;

  const canChangePassword =
    currentPassword.length > 0 &&
    isPasswordStrongEnough(newPassword) &&
    newPassword === confirmNewPassword &&
    !isChangingPassword;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be 2MB or smaller.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageError(null);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingProfile) return;

    try {
      await updateProfile({
        username: username.trim(),
        email: email.trim(),
        imageFile,
      }).unwrap();

      setImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      const refreshed = await refetch();
      if (refreshed.data) {
        dispatch(setCredentials(refreshed.data));
      }
    } catch {
      /* Server errors shown via apiClient toasts */
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmTouched(true);

    if (
      !currentPassword ||
      !isPasswordStrongEnough(newPassword) ||
      newPassword !== confirmNewPassword ||
      isChangingPassword
    ) {
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setConfirmTouched(false);
    } catch {
      /* Server errors shown via apiClient toasts */
    }
  };

  if (isMeLoading && !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading settings...
      </div>
    );
  }

  const displayImage = previewUrl ?? resolveMediaUrl(user?.profileImageUrl);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-1 border-b border-surface-container-highest pb-6">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Settings
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Manage your account credentials
        </p>
      </header>

      <form
        onSubmit={handleProfileSubmit}
        className="flex flex-col gap-6 rounded-lg border border-surface-container-highest bg-surface-container-low p-6 shadow-sm"
        noValidate
      >
        <div className="flex items-center gap-2 border-b border-surface-container-highest pb-4">
          <MaterialIcon name="person" className="text-on-surface-variant" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Profile
          </h2>
        </div>

        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3">
            <input
              id={avatarInputId}
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={openFilePicker}
              className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-surface-container-highest bg-surface"
              aria-label="Change profile photo"
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={username || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <MaterialIcon
                  name="person"
                  className="text-3xl text-on-surface-variant"
                />
              )}
              <span className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container/80 opacity-0 transition-opacity group-hover:opacity-100">
                <MaterialIcon
                  name="photo_camera"
                  className="mb-1 text-primary"
                />
                <span className="font-label-caps text-label-caps text-on-surface">
                  Change
                </span>
              </span>
            </button>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Max size 2MB
            </span>
            {imageError && (
              <span className="text-xs text-error">{imageError}</span>
            )}
          </div>

          <div className="flex w-full flex-1 flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="settings-username"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
              >
                Username
              </label>
              <input
                id="settings-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-outline-variant bg-surface px-3 py-2 font-data-mono text-data-mono text-on-surface transition-colors focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <span className="mt-1 text-xs font-body-sm text-body-sm text-on-surface-variant">
                This is your public display name.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="settings-email"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
              >
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-outline-variant bg-surface px-3 py-2 font-data-mono text-data-mono text-on-surface transition-colors focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="flex items-center gap-2 rounded bg-primary px-6 py-2.5 font-label-caps text-label-caps text-on-primary uppercase shadow-sm transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MaterialIcon name="save" className="text-lg" />
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="flex flex-col gap-6 rounded-lg border border-surface-container-highest bg-surface-container-low p-6 shadow-sm"
        noValidate
      >
        <div className="flex items-center gap-2 border-b border-surface-container-highest pb-4">
          <MaterialIcon name="lock" className="text-on-surface-variant" />
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Security
          </h2>
        </div>

        <div className="flex max-w-md flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="settings-current-password"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase"
            >
              Current Password
            </label>
            <input
              id="settings-current-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded border border-outline-variant bg-surface px-3 py-2 font-data-mono text-data-mono text-on-surface transition-colors focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label
              htmlFor="settings-new-password"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase"
            >
              New Password
            </label>
            <input
              id="settings-new-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded border border-outline-variant bg-surface px-3 py-2 font-data-mono text-data-mono text-on-surface transition-colors focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <span className="mt-1 text-xs font-body-sm text-body-sm text-on-surface-variant">
              Minimum 8 characters, including uppercase, lowercase, and a
              number.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="settings-confirm-password"
              className={`font-label-caps text-label-caps uppercase ${
                passwordsMismatch ? "text-error" : "text-on-surface-variant"
              }`}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="settings-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setConfirmTouched(true);
                }}
                onBlur={() => setConfirmTouched(true)}
                className={`w-full rounded border bg-surface px-3 py-2 pr-10 font-data-mono text-data-mono transition-colors focus:outline-none focus:ring-1 ${
                  passwordsMismatch
                    ? "border-error bg-error-container/10 text-error focus:ring-error"
                    : "border-outline-variant text-on-surface focus:border-primary focus:ring-primary"
                }`}
              />
              {passwordsMismatch && (
                <MaterialIcon
                  name="error"
                  filled
                  className="absolute top-2 right-3 text-error"
                />
              )}
            </div>
            {passwordsMismatch && (
              <span className="mt-1 flex items-center gap-1 text-xs font-body-sm text-body-sm text-error">
                Passwords do not match.
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex justify-start border-t border-surface-container-highest pt-4">
          <button
            type="submit"
            disabled={!canChangePassword}
            className="flex items-center gap-2 rounded border border-outline-variant bg-surface px-6 py-2.5 font-label-caps text-label-caps text-on-surface uppercase shadow-sm transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MaterialIcon name="key" className="text-lg" />
            {isChangingPassword ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
