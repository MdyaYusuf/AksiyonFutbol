export const PublicFooter = () => {
  return (
    <footer className="relative z-20 mt-auto border-t border-surface-variant bg-surface-container-lowest px-8 py-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} AksiyonFutbol. A Persistent Football Universe.
        </span>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
