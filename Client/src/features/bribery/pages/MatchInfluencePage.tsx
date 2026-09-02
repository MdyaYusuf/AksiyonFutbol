import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { useGetBriberyContextQuery } from "@/features/bribery/briberyApiSlice";
import type { BribeStakeTier, MatchInfluenceConfirmState } from "@/features/bribery/briberyTypes";
import { BribeAttemptOutcome } from "@/features/bribery/briberyTypes";
import { ApproachStakeOption } from "@/features/bribery/components/ApproachStakeOption";
import { MatchInfluenceContextCard } from "@/features/bribery/components/MatchInfluenceContextCard";
import { MatchInfluenceHeader } from "@/features/bribery/components/MatchInfluenceHeader";
import { buildStakeOptions } from "@/features/bribery/utils/matchInfluenceHelpers";

const pickDefaultTier = (
  options: ReturnType<typeof buildStakeOptions>,
  clubCash: number,
  alreadyAttempted: boolean,
): BribeStakeTier => {
  if (alreadyAttempted) {
    return "medium";
  }

  const affordable = options.filter((option) => option.amount <= clubCash);
  const preferred = affordable.find((option) => option.tier === "medium");

  if (preferred) {
    return preferred.tier;
  }

  if (affordable[0]) {
    return affordable[0].tier;
  }

  return "medium";
};

export const MatchInfluencePage = () => {
  const navigate = useNavigate();
  const { data: context, isLoading, isError } = useGetBriberyContextQuery();
  const [selectedTier, setSelectedTier] = useState<BribeStakeTier>("medium");

  const stakeOptions = useMemo(
    () => (context ? buildStakeOptions(context) : []),
    [context],
  );

  useEffect(() => {
    if (!context || stakeOptions.length === 0) {
      return;
    }

    setSelectedTier(
      pickDefaultTier(stakeOptions, context.clubCash, context.alreadyAttempted),
    );
  }, [context, stakeOptions]);

  const selectedOption = stakeOptions.find((option) => option.tier === selectedTier);
  const canContinue =
    !!context &&
    !context.alreadyAttempted &&
    !!selectedOption &&
    selectedOption.amount <= context.clubCash;

  const handleContinue = () => {
    if (!context || !selectedOption || !canContinue || !context.matchId) {
      return;
    }

    const state: MatchInfluenceConfirmState = {
      matchId: context.matchId,
      amount: selectedOption.amount,
      tier: selectedOption.tier,
      title: selectedOption.title,
      successChance: selectedOption.successChance,
      detectionChance: selectedOption.detectionChance,
      heatGenerated: selectedOption.heatGenerated,
      refereeName: context.refereeName ?? "",
      refereePersonality: context.refereePersonality ?? "",
      matchWeek: context.matchWeek ?? 0,
      homeClubName: context.homeClubName ?? "",
      awayClubName: context.awayClubName ?? "",
    };

    navigate("/app/actions/bribe/confirm", { state });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading match influence...
      </div>
    );
  }

  if (isError || !context || !context.canAttempt) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-16 text-center">
        <MaterialIcon name="gavel" className="text-4xl text-on-surface-variant" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {context?.unavailableReason ??
            "No upcoming fixture available for match influence, or the match has no assigned official."}
        </p>
        <Link to="/app/actions" className="text-primary hover:underline">
          Back to Actions
        </Link>
      </div>
    );
  }

  const outcomeLabel =
    context.existingOutcome === BribeAttemptOutcome.Succeeded
      ? "succeeded"
      : context.existingOutcome === BribeAttemptOutcome.Failed
        ? "failed"
        : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <MatchInfluenceHeader backTo="/app/actions" title="Match Influence" />

      <MatchInfluenceContextCard context={context} />

      {context.alreadyAttempted ? (
        <div className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-variant p-4">
          <MaterialIcon name="info" className="mt-0.5 text-primary" />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            You already made an influence attempt for this fixture
            {outcomeLabel ? ` (${outcomeLabel})` : ""}. Only one attempt is allowed per match.
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="border-b border-outline-variant pb-2 font-headline-sm text-headline-sm text-on-background">
          Approach Strategy
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {stakeOptions.map((option) => (
            <ApproachStakeOption
              key={option.tier}
              option={option}
              selected={selectedTier === option.tier}
              disabled={context.alreadyAttempted}
              unaffordable={option.amount > context.clubCash}
              onSelect={setSelectedTier}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-start gap-3 rounded-lg border border-secondary/30 bg-surface-variant p-4">
        <MaterialIcon name="error" className="mt-0.5 text-secondary" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <span className="font-bold text-secondary">Note:</span> Every approach adds club
          heat and carries a detection roll. Getting caught triggers fines, morale loss,
          and Legitimacy damage — all in-game fiction.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-4 border-t border-outline-variant pt-6">
        <Link
          to="/app/actions"
          className="rounded border border-outline-variant px-6 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className="flex items-center gap-2 rounded bg-primary px-8 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MaterialIcon name="payments" className="text-[18px]" />
          Continue
        </button>
      </div>
    </div>
  );
};
