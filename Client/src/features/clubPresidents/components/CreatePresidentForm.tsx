import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { OnboardingSteps } from "../../../core/components/onboarding/OnboardingSteps";
import { OnboardingTextField } from "../../../core/components/onboarding/OnboardingFields";
import { useCreateClubPresidentMutation } from "../clubPresidentsApiSlice";
import type { PresidentAttributes } from "../clubPresidentTypes";
import {
  PRESIDENT_ATTRIBUTE_POINT_BUDGET,
  createBasePresidentAttributes,
  getRemainingAttributePoints,
} from "../utils/presidentProfileHelpers";
import { PresidentAttributeAllocator } from "./PresidentAttributeAllocator";
import { PresidentPreviewCard } from "./PresidentPreviewCard";

const TITLE_SUGGESTIONS = ["The Visionary", "The Tactician", "Financial Tycoon"];

export const CreatePresidentForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [attributes, setAttributes] = useState<PresidentAttributes>(
    createBasePresidentAttributes,
  );
  const [createPresident, { isLoading }] = useCreateClubPresidentMutation();

  const remainingPoints = getRemainingAttributePoints(attributes);
  const isReady = name.trim().length > 0 && remainingPoints === 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isReady) {
      return;
    }

    try {
      await createPresident({
        name: name.trim(),
        title: title.trim() || null,
        charisma: attributes.charisma,
        authority: attributes.authority,
        integrity: attributes.integrity,
        cunning: attributes.cunning,
        connections: attributes.connections,
      }).unwrap();

      navigate("/app/onboarding/club", { replace: true });
    } catch {
      /* Server validation errors are shown via apiClient toasts */
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center p-6 md:p-12">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1 text-label-caps text-on-surface-variant">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              System Initialization
            </div>
            <h1 className="mb-2 text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
              Establish Identity
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Define your executive persona and allocate {PRESIDENT_ATTRIBUTE_POINT_BUDGET}{" "}
              build points. This identity is recorded in the club&apos;s permanent ledger.
            </p>
          </div>

          <OnboardingSteps currentStep="president" />

          <form className="mt-4 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <OnboardingTextField
              id="presidentName"
              name="name"
              label="President Name"
              icon="badge"
              placeholder="e.g., Arda Güler"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
            />

            <div className="flex flex-col gap-2">
              <OnboardingTextField
                id="presidentTitle"
                name="title"
                label="Executive Title"
                icon="workspace_premium"
                placeholder="e.g., The Visionary"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoComplete="off"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {TITLE_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTitle(suggestion)}
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-1 text-[10px] text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <PresidentAttributeAllocator
              attributes={attributes}
              onChange={setAttributes}
            />

            <button
              type="submit"
              disabled={isLoading || !isReady}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded bg-primary-container py-4 text-label-caps text-on-primary-container transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Kaydediliyor..." : "Finalize Persona"}
              <MaterialIcon
                name="arrow_forward"
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>

        <div className="flex justify-center lg:col-span-7 lg:justify-end">
          <PresidentPreviewCard
            name={name.trim()}
            title={title.trim()}
            attributes={attributes}
            remainingPoints={remainingPoints}
            isReady={isReady}
          />
        </div>
      </div>
    </div>
  );
};
