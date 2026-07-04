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
  const [pageNumber, setPageNumber] = useState(1);

  const filteredPlayers = useMemo(
    () => filterSquadPlayers(players, positionFilter, searchQuery),
    [players, positionFilter, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));

  useEffect(() => {
    setPageNumber(1);
  }, [positionFilter, searchQuery]);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  const pagePlayers = useMemo(
    () => paginatePlayers(filteredPlayers, pageNumber, PAGE_SIZE),
    [filteredPlayers, pageNumber],
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
        positionFilter={positionFilter}
        onPositionFilterChange={setPositionFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <SquadTable
        players={pagePlayers}
        totalCount={filteredPlayers.length}
        pageNumber={pageNumber}
        pageSize={PAGE_SIZE}
        onPrevPage={() => setPageNumber((current) => Math.max(1, current - 1))}
        onNextPage={() =>
          setPageNumber((current) => Math.min(totalPages, current + 1))
        }
      />
    </div>
  );
};
