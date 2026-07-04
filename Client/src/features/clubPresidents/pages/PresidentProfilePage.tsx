import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../../../core/store/hooks";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { useGetMatchesByClubIdQuery } from "../../matches/matchesApiSlice";
import { AccountStatusCard } from "../components/AccountStatusCard";
import { CareerHistoryCard } from "../components/CareerHistoryCard";
import { PresidentIdentityCard } from "../components/PresidentIdentityCard";
import { TitlesWonCard } from "../components/TitlesWonCard";
import { useGetCurrentUserClubPresidentQuery } from "../clubPresidentsApiSlice";
import {
  getPlayedMatchCount,
  getWinRate,
} from "../utils/presidentProfileHelpers";

export const PresidentProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: president, isLoading: isPresidentLoading } =
    useGetCurrentUserClubPresidentQuery();
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: matches = [], isLoading: isMatchesLoading } =
    useGetMatchesByClubIdQuery(club?.id ?? skipToken);

  const isLoading = isPresidentLoading || isClubLoading || isMatchesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Başkan profili yükleniyor...
      </div>
    );
  }

  if (!president) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Başkan profili bulunamadı.
      </div>
    );
  }

  const winRate = club ? getWinRate(matches, club.id) : null;
  const matchCount = getPlayedMatchCount(matches);

  return (
    <div
      className="relative mx-auto max-w-7xl space-y-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="mb-2">
        <h2 className="text-headline-sm font-black text-primary">President Overview</h2>
      </div>

      <PresidentIdentityCard
        president={president}
        club={club}
        winRate={winRate}
        profileImageUrl={user?.profileImageUrl}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CareerHistoryCard
          president={president}
          club={club}
          matchCount={matchCount}
          winRate={winRate}
        />
        <TitlesWonCard />
      </div>

      <AccountStatusCard president={president} email={user?.email} />
    </div>
  );
};
