import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface MatchInfluenceHeaderProps {
  backTo?: string;
  title?: string;
  subtitle?: string;
}

export const MatchInfluenceHeader = ({
  backTo = "/app/actions",
  title = "Match Influence",
  subtitle = "Weigh risk against reward before kickoff",
}: MatchInfluenceHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 border-b border-outline-variant pb-6">
      <div className="flex items-center gap-3">
        <Link
          to={backTo}
          className="-ml-2 flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          aria-label="Back"
        >
          <MaterialIcon name="arrow_back" />
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-background">
          {title}
        </h1>
      </div>
      <p className="ml-10 font-body-lg text-body-lg text-on-surface-variant">
        {subtitle}
      </p>
    </div>
  );
};
