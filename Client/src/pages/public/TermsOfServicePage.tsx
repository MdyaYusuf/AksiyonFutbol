import { LegalDocumentHeader } from "./components/LegalDocumentHeader";

const LAST_UPDATED = "July 14, 2026";

export const TermsOfServicePage = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-container-padding py-12">
      <LegalDocumentHeader title="Terms of Service" lastUpdated={LAST_UPDATED} />

      <article className="space-y-10 text-body-lg text-on-surface">
        <section className="space-y-4">
          <h2 className="text-headline-md font-bold text-primary-fixed-dim">1. Introduction</h2>
          <div className="space-y-4">
            <p>
              Welcome to AksiyonFutbol, a persistent football management simulation. By
              accessing or using our platform, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, you may not access or use our
              services.
            </p>
            <p>
              These terms govern your access to the club presidency tools, player
              databases, fixtures, and match simulation systems that constitute the
              AksiyonFutbol experience. The game world, clubs, leagues, and characters
              are fictional and are not affiliated with any real organization. We reserve
              the right to update these terms to reflect changes in our platform or legal
              requirements.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-headline-md font-bold text-primary-fixed-dim">
            2. Account Registration
          </h2>
          <div className="space-y-4">
            <p>
              To participate fully, you must register for an account. You agree to provide
              accurate, current, and complete information during registration and to keep
              that information up to date.
            </p>
            <p>
              You are solely responsible for safeguarding the password you use to access
              the service. You agree not to disclose your password to any third party and
              to take responsibility for activities under your account, whether or not you
              authorized them.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-headline-md font-bold text-primary-fixed-dim">3. User Conduct</h2>
          <div className="space-y-4">
            <p>
              The integrity of the simulation relies on fair play. You agree not to engage
              in activity that interferes with or disrupts the services, or the servers
              and networks connected to them.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Exploiting bugs, glitches, or vulnerabilities in the simulation engine.</li>
              <li>
                Using automated scripts, bots, or unapproved third-party tools to interact
                with the database.
              </li>
              <li>
                Engaging in market manipulation or collusive behavior regarding player
                transfers.
              </li>
              <li>
                Harassing, abusing, or harming other managers within the platform&apos;s
                communication channels.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-headline-md font-bold text-primary-fixed-dim">
            4. Virtual Currency
          </h2>
          <div className="space-y-4">
            <p>
              AksiyonFutbol may include in-game cash, wage budgets, or other virtual items
              (&quot;Virtual Goods&quot;) for use within the simulation. You acknowledge that you
              do not own these Virtual Goods but instead hold a limited, personal,
              non-transferable, revocable license to use them.
            </p>
            <p>
              Virtual Goods have no real-world value and cannot be exchanged for fiat
              currency or any other real-world asset. We reserve the right to manage,
              regulate, modify, or eliminate Virtual Goods at our sole discretion without
              liability to you.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-headline-md font-bold text-primary-fixed-dim">5. Termination</h2>
          <div className="space-y-4">
            <p>
              We may terminate or suspend your account and bar access to the service
              immediately, without prior notice or liability, under our sole discretion,
              for any reason whatsoever, including but not limited to a breach of these
              Terms.
            </p>
            <p>
              If you wish to terminate your account, you may discontinue using the
              service. Provisions that by their nature should survive termination shall
              survive, including ownership provisions, warranty disclaimers, indemnity,
              and limitations of liability.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
};
