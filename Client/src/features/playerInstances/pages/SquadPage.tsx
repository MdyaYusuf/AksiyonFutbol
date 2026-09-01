import { useEffect, useMemo, useState } from "react";
import { SquadHeader } from "../components/SquadHeader";
import { SquadTable } from "../components/SquadTable";
import { useGetCurrentUserClubPlayersQuery } from "../playerInstancesApiSlice";
import {
  filterSquadPlayers,
  paginatePlayers,
  type SquadPositionFilter,
} from "../utils/squadHelpers";

const PAGE_SIZE = 10;

export const SquadPage = () => {
  const { data: players = [], isLoading } = useGetCurrentUserClubPlayersQuery();
  const [positionFilter, setPositionFilter] = useState<SquadPositionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPlayers = useMemo(
    () => filterSquadPlayers(players, positionFilter, searchQuery),
    [players, positionFilter, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [positionFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagePlayers = useMemo(
    () => paginatePlayers(filteredPlayers, currentPage, PAGE_SIZE),
    [filteredPlayers, currentPage],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Kadro yükleniyor...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <SquadHeader
        squadCount={players.length}
        positionFilter={positionFilter}
        onPositionFilterChange={setPositionFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <SquadTable
        players={pagePlayers}
        totalCount={filteredPlayers.length}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPrevPage={() => setCurrentPage((current) => Math.max(1, current - 1))}
        onNextPage={() =>
          setCurrentPage((current) => Math.min(totalPages, current + 1))
        }
      />
    </div>
  );
};
