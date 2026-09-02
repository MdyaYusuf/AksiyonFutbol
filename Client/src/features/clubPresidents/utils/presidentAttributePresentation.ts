import type { PresidentAttributeKey } from "@/features/clubPresidents/clubPresidentTypes";

export type PresidentAttributeAccent = {
  bar: string;
  text: string;
  badge: string;
};

/** Shared president-attribute palette for profile bars and action requirement chips. */
export const presidentAttributeAccents: Record<
  PresidentAttributeKey,
  PresidentAttributeAccent
> = {
  charisma: {
    bar: "bg-primary",
    text: "text-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
  },
  authority: {
    bar: "bg-orange-400",
    text: "text-orange-400",
    badge: "border-orange-400/30 bg-orange-400/10 text-orange-400",
  },
  integrity: {
    bar: "bg-teal-400",
    text: "text-teal-400",
    badge: "border-teal-400/30 bg-teal-400/10 text-teal-400",
  },
  cunning: {
    bar: "bg-tertiary",
    text: "text-tertiary",
    badge: "border-tertiary/30 bg-tertiary/10 text-tertiary",
  },
  connections: {
    bar: "bg-sky-400",
    text: "text-sky-400",
    badge: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  },
};

export const getPresidentAttributeBarClass = (key: PresidentAttributeKey): string => {
  return presidentAttributeAccents[key].bar;
};

export const getPresidentAttributeTextClass = (key: PresidentAttributeKey): string => {
  return presidentAttributeAccents[key].text;
};

export const getPresidentAttributeBadgeClass = (key: PresidentAttributeKey): string => {
  return presidentAttributeAccents[key].badge;
};
