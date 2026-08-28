import { useState } from "react";
import { FictionalDisclaimer } from "../../core/components/legal/FictionalDisclaimer";
import { MaterialIcon } from "../../core/components/ui/MaterialIcon";

const FAQ_ITEMS = [
  {
    question: "How do I reset my password?",
    answer:
      "Sign in to your account and open Settings when available, or contact support if you cannot access your account. We will help you restore access through your registered email. Check your spam folder if you do not see a reply within a short time.",
  },
  {
    question: "How does the match week work?",
    answer:
      "AksiyonFutbol advances through league match weeks. After fixtures are scheduled, an administrator processes the week to simulate unplayed matches and move the division forward. Results then appear on fixtures, dashboards, and match reports.",
  },
  {
    question: "How do I join a league?",
    answer:
      "After you register, create your club president profile and club. Your club is placed into a league division during onboarding. From there you can follow standings, fixtures, and results for your division.",
  },
] as const;

const MOBILE_LAUNCH_CHECKLIST = [
  {
    title: "IARC content rating",
    detail:
      "Complete the IARC questionnaire for Google Play / App Store before shipping a mobile build. Map gray-area actions, bribery, and scandal themes honestly.",
  },
  {
    title: "Age gate",
    detail:
      "The web client now asks players to confirm they are 13+. Reuse the same minimum age and copy in native onboarding.",
  },
  {
    title: "Fictional disclaimer",
    detail:
      "Landing, registration, support, and in-game hubs state that clubs, leagues, and press stories are invented gameplay fiction.",
  },
  {
    title: "No real-world trademarks",
    detail:
      "Avoid real club, federation, or player names in marketing copy, demo text, and seeded content. User-created club names remain player responsibility.",
  },
] as const;

export const SupportPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-container-padding py-12">
      <header className="space-y-4 text-center">
        <h1 className="text-display-lg font-extrabold tracking-tight text-primary">
          Support
        </h1>
        <p className="text-headline-md text-on-surface-variant">How can we help you?</p>
      </header>

      <FictionalDisclaimer />

      <section className="space-y-4 rounded-xl border border-outline-variant bg-surface-container p-6">
        <h2 className="text-headline-sm font-bold text-on-surface">Mobile launch checklist</h2>
        <p className="text-body-sm text-on-surface-variant">
          Use this list when preparing store listings and compliance review for a future mobile
          client.
        </p>
        <ul className="space-y-4">
          {MOBILE_LAUNCH_CHECKLIST.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-outline-variant bg-surface-container-high p-4"
            >
              <h3 className="text-body-sm font-semibold text-on-surface">{item.title}</h3>
              <p className="mt-1 text-body-sm text-on-surface-variant">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-outline-variant bg-surface-container-high p-8 text-center transition-colors hover:bg-surface-variant">
        <MaterialIcon name="mail" filled className="text-4xl text-secondary" />
        <div className="space-y-1">
          <h2 className="text-headline-sm font-semibold text-on-surface">
            Contact Us Directly
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            For urgent inquiries, reach out to our support team.
          </p>
        </div>
        <a
          href="mailto:support@aksiyonfutbol.com"
          className="mt-4 inline-block text-stat-value font-bold text-primary transition-colors hover:text-primary-fixed-dim"
        >
          support@aksiyonfutbol.com
        </a>
      </section>

      <section className="space-y-6">
        <h2 className="border-b border-outline-variant pb-2 text-headline-md font-bold text-on-surface">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-surface-container-high focus:outline-none"
                >
                  <span className="text-headline-sm font-semibold text-on-surface">
                    {item.question}
                  </span>
                  <MaterialIcon
                    name="expand_more"
                    className={[
                      "text-on-surface-variant transition-transform duration-300",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                <div
                  className={[
                    "overflow-hidden border-outline-variant bg-surface-container-low transition-all duration-300",
                    isOpen
                      ? "max-h-96 border-t px-4 py-4 opacity-100"
                      : "max-h-0 border-t-0 px-4 py-0 opacity-0",
                  ].join(" ")}
                >
                  <p className="text-body-lg text-on-surface-variant">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
