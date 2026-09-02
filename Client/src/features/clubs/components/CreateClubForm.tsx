import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { OnboardingSteps } from "@/core/components/onboarding/OnboardingSteps";
import { OnboardingTextField } from "@/core/components/onboarding/OnboardingFields";
import { ONBOARDING_DRAFT_PATH } from "@/core/routes/onboardingPaths";
import { useCreateClubMutation } from "@/features/clubs/clubsApiSlice";

export const CreateClubForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [createClub, { isLoading }] = useCreateClubMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return;
    }

    try {
      await createClub({
        name: trimmedName,
      }).unwrap();

      navigate(ONBOARDING_DRAFT_PATH, { replace: true });
    } catch {
      /* Server validation errors are shown via apiClient toasts */
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 md:p-12">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-primary lg:text-display-lg lg:leading-[56px]">
            Found Your Club
          </h1>
          <p className="max-w-xl text-body-lg text-on-surface-variant">
            Name your club, then draft your squad and enter a private placement league.
          </p>
        </div>

        <OnboardingSteps currentStep="club" />

        <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container/60 p-6 shadow-2xl backdrop-blur-md">
            <div>
              <h2 className="mb-1 flex items-center gap-2 text-headline-md text-on-surface">
                <MaterialIcon name="shield" className="text-primary" filled />
                Club Identity
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Register your official club name with the FA.
              </p>
            </div>

            <OnboardingTextField
              id="clubName"
              name="name"
              label="Official Club Name"
              placeholder="e.g., Aksiyon United"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || name.trim().length < 2}
              className="flex items-center gap-3 rounded bg-primary px-8 py-4 text-headline-sm text-on-primary shadow-lg transition-all hover:bg-primary-fixed-dim disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Kuruluyor..." : "Found Club"}
              <MaterialIcon name="arrow_forward" filled />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
