import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../../features/auth/authService";
import { useAppSelector } from "../../store/hooks";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { MaterialIcon } from "./MaterialIcon";

interface UserAccountMenuProps {
  settingsPath: string;
}

export const UserAccountMenu = ({ settingsPath }: UserAccountMenuProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = resolveMediaUrl(user?.profileImageUrl);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    authService.logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high transition-colors hover:border-primary"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.username ?? "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
        )}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded border border-outline-variant bg-surface-container-high shadow-lg"
        >
          <div className="border-b border-outline-variant px-3 py-3">
            <p className="truncate font-body-sm font-semibold text-on-surface">
              {user?.username ?? "Account"}
            </p>
            {user?.email ? (
              <p className="truncate font-data-mono text-xs text-on-surface-variant">
                {user.email}
              </p>
            ) : null}
          </div>

          <Link
            role="menuitem"
            to={settingsPath}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            <MaterialIcon name="settings" className="text-sm text-on-surface-variant" />
            Settings
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-body-sm text-error transition-colors hover:bg-surface-variant"
          >
            <MaterialIcon name="logout" className="text-sm" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
};
