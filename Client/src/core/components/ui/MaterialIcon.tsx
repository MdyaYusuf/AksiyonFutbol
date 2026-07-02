interface MaterialIconProps {
  name: string;
  className?: string;
}

export const MaterialIcon = ({ name, className = "" }: MaterialIconProps) => {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
};
