import { MaterialIcon } from "../../core/components/ui/MaterialIcon";
import { LegalDocumentHeader } from "./components/LegalDocumentHeader";

const LAST_UPDATED = "July 14, 2026";

export const PrivacyPolicyPage = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-container-padding py-16">
      <LegalDocumentHeader
        title="Privacy Policy"
        lastUpdated={LAST_UPDATED}
        showCalendarIcon
      />

      <article className="space-y-10 text-body-lg leading-relaxed text-on-surface-variant">
        <p>
          Welcome to AksiyonFutbol. As a persistent football management platform, we treat
          account and club data carefully. This Privacy Policy explains how we collect,
          process, and secure information while you use our services.
        </p>

        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
            <MaterialIcon name="database" className="text-primary" />
            1. Data Collection
          </h2>
          <p className="mb-4">
            To provide account access, club management, and match simulation features, we
            collect several categories of information:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-on-surface">Account Credentials:</strong> Username,
              email, role, and authentication-related session data required to sign you
              in.
            </li>
            <li>
              <strong className="text-on-surface">Game Progress:</strong> Club presidency
              profiles, clubs, squads, fixtures, and match results tied to your account.
            </li>
            <li>
              <strong className="text-on-surface">Usage Data:</strong> Basic interaction and
              session information used to keep the service reliable and diagnose issues.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
            <MaterialIcon name="analytics" className="text-primary" />
            2. How We Use Information
          </h2>
          <p className="mb-4">
            Collected data is used to operate and improve AksiyonFutbol. Primary uses
            include:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Authenticating users and restoring sessions securely.</li>
            <li>Persisting clubs, squads, fixtures, and match outcomes.</li>
            <li>Powering admin tools that maintain the game world.</li>
            <li>Providing technical support and investigating service issues.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
            <MaterialIcon name="handshake" className="text-primary" />
            3. Third-Party Sharing
          </h2>
          <p className="mb-4">
            We do not sell your account or club data. Information is shared only under
            limited conditions:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-on-surface">Infrastructure Partners:</strong> Cloud
              and hosting providers needed to run the application, under appropriate
              safeguards.
            </li>
            <li>
              <strong className="text-on-surface">Legal Compliance:</strong> When required
              to comply with applicable law or binding legal requests.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
            <MaterialIcon name="shield_lock" className="text-primary" />
            4. Data Security
          </h2>
          <p className="mb-4">
            We apply standard web security practices to protect accounts and game data.
          </p>
          <div className="mt-4 rounded border border-outline-variant bg-surface-container-high p-4">
            <p className="mb-2 font-data-mono text-data-mono text-primary">
              // Security Protocol Active
            </p>
            <p className="text-sm text-on-surface-variant">
              Traffic is protected with HTTPS in production configurations. Passwords are
              stored using one-way hashing. Session tokens for web clients are transported
              with secure cookie practices where configured. Access to administrative
              tooling is role-restricted.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
            <MaterialIcon name="gavel" className="text-primary" />
            5. Your Rights
          </h2>
          <p className="mb-4">You may request to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Access information held about your account.</li>
            <li>Correct inaccurate account profile details.</li>
            <li>Request deletion of your account and associated game data where feasible.</li>
          </ul>
          <p className="mt-6 border-l-2 border-primary pl-4 text-on-surface">
            For privacy requests, contact{" "}
            <a
              href="mailto:support@aksiyonfutbol.com"
              className="text-primary transition-colors hover:text-primary-fixed-dim"
            >
              support@aksiyonfutbol.com
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
};
