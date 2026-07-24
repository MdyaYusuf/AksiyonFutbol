import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { EndOfSeasonHeader } from "../components/EndOfSeasonHeader";
import {
  EndOfSeasonBoardReview,
  EndOfSeasonMovementsPanel,
} from "../components/EndOfSeasonSidePanel";
import { EndOfSeasonStandingsTable } from "../components/EndOfSeasonStandingsTable";
import {
  useGetSeasonEndPreviewQuery,
  useProcessSeasonEndMutation,
} from "../seasonTransitionsApiSlice";
import {
  buildCondensedStandings,
  getBoardReview,
  getPromotedMovements,
  getRelegatedMovements,
  getUserDivisionPreview,
} from "../utils/endOfSeasonHelpers";

export const EndOfSeasonMovementsPage = () => {
  const navigate = useNavigate();
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const {
    data: preview,
    isLoading: isPreviewLoading,
    isError,
  } = useGetSeasonEndPreviewQuery(club?.divisionId ?? skipToken);
  const [processSeasonEnd, { isLoading: isSubmitting }] = useProcessSeasonEndMutation();

  const handleContinue = async () => {
    if (!club || !preview?.canProcess) {
      return;
    }

    try {
      await processSeasonEnd(club.divisionId).unwrap();
      navigate("/app/league", { replace: true });
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isClubLoading || isPreviewLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading season summary...
      </div>
    );
  }

  if (!club || isError || !preview) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-16 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Season end summary is not available yet.
        </p>
        <Link to="/app/league" className="text-primary hover:underline">
          Back to League
        </Link>
      </div>
    );
  }

  const userDivision = getUserDivisionPreview(preview, club.divisionId);

  if (!userDivision) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-16 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Your division was not found in the season-end preview.
        </p>
        <Link to="/app/league" className="text-primary hover:underline">
          Back to League
        </Link>
      </div>
    );
  }

  const promoted = getPromotedMovements(preview.movements, userDivision.divisionId);
  const relegated = getRelegatedMovements(preview.movements, userDivision.divisionId);
  const promotedIds = new Set(promoted.map((movement) => movement.clubId));
  const relegatedIds = new Set(relegated.map((movement) => movement.clubId));
  const condensedRows = buildCondensedStandings(
    userDivision.standings,
    club.id,
    preview.swapSlots,
  );
  const board = getBoardReview(userDivision.standings, club.id);
  const promoteTargetName = promoted[0]?.toDivisionName;
  const relegateTargetName = relegated[0]?.toDivisionName;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <EndOfSeasonHeader
        divisionName={userDivision.divisionName}
        matchWeek={userDivision.currentMatchWeek}
        canProcess={preview.canProcess}
        isSubmitting={isSubmitting}
        blockReason={preview.blockReason}
        onContinue={handleContinue}
      />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <EndOfSeasonStandingsTable
          rows={condensedRows}
          currentClubId={club.id}
          promotedClubIds={promotedIds}
          relegatedClubIds={relegatedIds}
          matchWeekLabel={`Matchday ${userDivision.currentMatchWeek} of ${userDivision.currentMatchWeek}`}
        />

        <div className="flex flex-col gap-6">
          <EndOfSeasonBoardReview
            objective={board.objective}
            result={board.result}
            achieved={board.achieved}
            rating={board.rating}
          />
          <EndOfSeasonMovementsPanel
            promoted={promoted}
            relegated={relegated}
            promoteTargetName={promoteTargetName}
            relegateTargetName={relegateTargetName}
          />
        </div>
      </div>
    </div>
  );
};
