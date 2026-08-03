import { skipToken } from "@reduxjs/toolkit/query";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  OnboardingSelectField,
  OnboardingTextField,
} from "../../../core/components/onboarding/OnboardingFields";
import { useGetLeagueDivisionsQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";
import {
  useCreateClubMutation,
  useGetClubsByDivisionIdQuery,
} from "../clubsApiSlice";

const formatDivisionLabel = (division: LeagueDivisionResponse): string => {
  if (division.name) {
    return division.name;
  }

  return `Tier ${division.tier} - Group ${division.groupNumber}`;
};

export const CreateClubForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [divisionId, setDivisionId] = useState<number | "">("");
  const [createClub, { isLoading }] = useCreateClubMutation();

  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 100,
  });

  const divisions = divisionsData?.items ?? [];
  const selectedDivisionId = divisionId === "" ? undefined : divisionId;

  const { data: divisionClubs = [] } = useGetClubsByDivisionIdQuery(
    selectedDivisionId ?? skipToken,
  );

  const selectedDivision = divisions.find((division) => division.id === selectedDivisionId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedDivisionId === undefined) {
      return;
    }

    try {
      await createClub({
        name: name.trim(),
        divisionId: selectedDivisionId,
      }).unwrap();

      navigate("/app/dashboard", { replace: true });
    } catch {
      /* Server validation errors are shown via apiClient toasts */
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 md:p-12">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-primary lg:text-display-lg lg:leading-[56px]">
            Found Your Club
          </h1>
          <p className="max-w-xl text-body-lg text-on-surface-variant">
            Step into the management seat. Define your identity, choose your battleground,
            and prepare for the inaugural season.
          </p>
        </div>

        {isDivisionsLoading ? (
          <p className="text-center text-on-surface-variant">Ligler yükleniyor...</p>
        ) : (
          <form className="grid grid-cols-1 gap-4 md:grid-cols-12" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container/60 p-6 shadow-2xl backdrop-blur-md md:col-span-7">
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

            <div className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container/60 p-6 shadow-2xl backdrop-blur-md md:col-span-5">
              <div>
                <h2 className="mb-1 flex items-center gap-2 text-headline-md text-on-surface">
                  <MaterialIcon name="trophy" className="text-secondary" filled />
                  League Entry
                </h2>
                <p className="text-body-sm text-on-surface-variant">Select your starting tier.</p>
              </div>

              <OnboardingSelectField
                id="division"
                name="divisionId"
                label="Available Divisions"
                value={divisionId}
                onChange={(event) => {
                  const value = event.target.value;
                  setDivisionId(value === "" ? "" : Number(value));
                }}
              >
                <option value="" disabled>
                  Select a division
                </option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {formatDivisionLabel(division)}
                  </option>
                ))}
              </OnboardingSelectField>

              {selectedDivision && (
                <div className="flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                    <span className="text-label-caps text-on-surface-variant">League Size</span>
                    <span className="font-data-mono text-on-surface">
                      {divisionClubs.length} Teams
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                    <span className="text-label-caps text-on-surface-variant">Status</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-label-caps text-primary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      Match Week {selectedDivision.currentMatchWeek} Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-label-caps text-on-surface-variant">
                      Competition Level
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={[
                            "h-3 w-3 rounded-sm",
                            level <= Math.min(3, Math.max(1, 4 - selectedDivision.tier))
                              ? "bg-secondary"
                              : "border border-outline-variant bg-surface-variant",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end md:col-span-12">
              <button
                type="submit"
                disabled={isLoading || selectedDivisionId === undefined}
                className="flex items-center gap-3 rounded bg-primary px-8 py-4 text-headline-sm text-on-primary shadow-lg transition-all hover:bg-primary-fixed-dim disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Kuruluyor..." : "Found Club"}
                <MaterialIcon name="arrow_forward" filled />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
