const NATIONALITY_FLAG_FILES: Record<string, string> = {
  algeria: "algeria.png",
  brazil: "brazil.png",
  bulgaria: "bulgaria.png",
  colombia: "colombia.png",
  croatia: "croatia.png",
  czechia: "czechia.png",
  denmark: "denmark.png",
  egypt: "egypt.png",
  england: "england.png",
  france: "france.png",
  germany: "germany.png",
  ireland: "ireland.png",
  italy: "italy.png",
  japan: "japan.png",
  mexico: "mexico.png",
  morocco: "morocco.png",
  nigeria: "nigeria.png",
  norway: "norway.png",
  poland: "poland.png",
  portugal: "portugal.png",
  romania: "romania.png",
  russia: "russia.png",
  serbia: "serbia.png",
  slovakia: "slovakia.png",
  slovenia: "slovenia.png",
  spain: "spain.png",
  sweden: "sweden.png",
  switzerland: "switzerland.png",
  tunisia: "tunisia.png",
  turkey: "turkey.png",
  usa: "usa.png",
  ukraine: "ukraine.png",
};

export const getNationalityFlagSrc = (
  nationality?: string | null,
): string | null => {
  if (!nationality) {
    return null;
  }

  const fileName = NATIONALITY_FLAG_FILES[nationality.trim().toLowerCase()];

  if (!fileName) {
    return null;
  }

  return `/flags/${fileName}`;
};
