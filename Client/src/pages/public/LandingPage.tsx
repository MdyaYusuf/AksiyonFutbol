import { Link } from "react-router-dom";
import { FictionalDisclaimer } from "../../core/components/legal/FictionalDisclaimer";
import { MaterialIcon } from "../../core/components/ui/MaterialIcon";

export const LandingPage = () => {
  return (
    <div className="relative flex flex-grow flex-col items-center justify-center overflow-hidden p-8 lg:p-16">
      <div className="bg-pattern pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-fixed opacity-5 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary-container opacity-5 blur-[120px]" />

      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <section className="col-span-1 flex flex-col gap-8 lg:col-span-6">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-max items-center gap-2 rounded-full border border-surface-variant bg-surface-container-high px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary-container" />
              <span className="text-label-caps text-on-surface">SEASON 14 LIVE</span>
            </div>
            <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-on-background lg:text-display-lg lg:leading-[56px]">
              Step into the boots of a{" "}
              <span className="text-primary">Club President</span>.
            </h1>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
              Build your club from the ground up, manage your squad, and dominate the
              leagues in a persistent, high-stakes football world. Every tactical
              decision, every transfer, and every contract negotiation shapes your
              legacy.
            </p>
            <FictionalDisclaimer compact className="max-w-xl" />
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 rounded bg-primary-container px-8 py-4 text-headline-sm text-on-primary-container transition-colors hover:bg-primary-fixed"
            >
              Register Your Club
              <MaterialIcon name="arrow_forward" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-high px-8 py-4 text-headline-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Manager Login
            </Link>
          </div>
        </section>

        <section className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-6">
          <div className="group relative col-span-2 flex flex-col gap-4 overflow-hidden rounded border border-outline-variant bg-surface-container-low p-4 shadow-lg">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface-container-low to-transparent opacity-50" />
            <div className="flex items-center justify-between border-b border-surface-variant pb-2">
              <span className="text-label-caps text-on-surface-variant">
                Live Match Engine
              </span>
              <MaterialIcon name="sensors" className="text-[16px] text-primary-container" />
            </div>
            <div className="relative z-0 flex flex-col gap-2 font-data-mono text-data-mono text-on-surface">
              <div className="flex gap-4 opacity-40">
                <span className="w-8 text-on-surface-variant">72&apos;</span>
                <span>
                  Midfield interception by <span className="text-secondary">Demir</span>.
                </span>
              </div>
              <div className="flex gap-4 opacity-60">
                <span className="w-8 text-on-surface-variant">73&apos;</span>
                <span>Through ball played into the penalty area.</span>
              </div>
              <div className="flex gap-4 opacity-80">
                <span className="w-8 text-on-surface-variant">74&apos;</span>
                <span>
                  <span className="font-bold text-primary-container">SHOT!</span> Striker
                  connects cleanly.
                </span>
              </div>
              <div className="-ml-[10px] flex gap-4 border-l-2 border-primary-container bg-surface-container-high py-1 pl-2">
                <span className="w-[26px] text-primary-container">74&apos;</span>
                <span className="font-bold text-primary-container">
                  GOAL! Top right corner. xG: 0.84
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center gap-3 rounded border border-outline-variant bg-surface-container-low p-6 shadow-lg">
            <span className="text-label-caps text-on-surface-variant">Global Rep</span>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg
                className="absolute h-full w-full -rotate-90 transform"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-surface-variant"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="82, 100"
                  strokeWidth="2"
                />
              </svg>
              <span className="absolute text-display-lg text-secondary">82</span>
            </div>
            <span className="text-body-sm text-on-surface">Elite Division</span>
          </div>

          <div className="col-span-1 flex flex-col justify-between gap-4 rounded border border-outline-variant bg-surface-container-low p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <span className="text-label-caps text-on-surface-variant">
                Club Valuation
              </span>
              <MaterialIcon name="account_balance" className="text-on-surface-variant" />
            </div>
            <div className="flex flex-col">
              <span className="text-display-lg tracking-tighter text-on-background">
                $24.5M
              </span>
              <div className="mt-1 flex items-center gap-1 text-body-sm text-primary-container">
                <MaterialIcon name="trending_up" className="text-[14px]" />
                <span>+4.2% this season</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
