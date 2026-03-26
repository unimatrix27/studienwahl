import { readFileSync } from "fs";
import { parse } from "yaml";

interface CvLanguage {
  name: string;
  level: number;
  label: string;
}

interface CvEntry {
  title: string;
  date: string;
  institution: string;
  location: string;
  description?: string;
}

interface CvData {
  personal: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    birthdate: string;
    birthplace: string;
    photo?: string;
  };
  languages: CvLanguage[];
  it_skills: string[];
  strengths: string[];
  interests: string[];
  education: CvEntry[];
  experience: CvEntry[];
  training: CvEntry[];
}

function escapeTypst(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function generateEntries(entries: CvEntry[]): string {
  return entries
    .map((e) => {
      const desc = e.description?.trim();
      const body = desc ? `\n  ${desc}\n` : "";
      return `#entry(
  title: "${escapeTypst(e.title)}",
  date: "${escapeTypst(e.date)}",
  institution: "${escapeTypst(e.institution)}",
  location: "${escapeTypst(e.location)}",
)[${body}]`;
    })
    .join("\n\n");
}

export function generateTypst(yamlPath: string): string {
  const raw = readFileSync(yamlPath, "utf-8");
  const data: CvData = parse(raw);
  const p = data.personal;

  const addressTypst = p.address.replace(/\n/g, "\\ ");

  const languageLines = data.languages
    .map(
      (l) =>
        `  #item-with-level("${escapeTypst(l.name)}", ${l.level}, subtitle: "${escapeTypst(l.label)}")`
    )
    .join("\n");

  const itSkillLines = data.it_skills.map((s) => `  - ${s}`).join("\n");

  const strengthsList = data.strengths
    .map((s) => `    "${escapeTypst(s)}",`)
    .join("\n");

  const interestsList = data.interests
    .map((s) => `    "${escapeTypst(s)}",`)
    .join("\n");

  const photoLine = p.photo
    ? `  profile-picture: image("${escapeTypst(p.photo)}"),`
    : "";

  return `#import "@preview/neat-cv:0.7.0": cv, side, entry, item-with-level, item-pills, contact-info, social-links

#set text(lang: "de")

#show: cv.with(
  author: (
    firstname: "${escapeTypst(p.firstname)}",
    lastname: "${escapeTypst(p.lastname)}",
    email: "${escapeTypst(p.email)}",
    phone: "${escapeTypst(p.phone)}",
    address: [${addressTypst}],
    position: ("Lebenslauf",),
  ),
${photoLine}
  accent-color: rgb("#2563eb"),
  header-color: rgb("#1e293b"),
  paper-size: "a4",
  heading-font: "Helvetica Neue",
  body-font: ("Helvetica Neue",),
  date: auto,
)

#side[
  = Persönliche Daten
  Geburtsdatum: ${p.birthdate} \\
  Geburtsort: ${p.birthplace}

  = Kontakt
  #contact-info()

  = Sprachen
${languageLines}

  = IT-Kenntnisse
${itSkillLines}

  = Stärken
  #item-pills((
${strengthsList}
  ))

  = Interessen
  #item-pills((
${interestsList}
  ))
]

= Bildungsweg

${generateEntries(data.education)}

= Praktische Erfahrung

${generateEntries(data.experience)}

= Weiterbildung

${generateEntries(data.training)}
`;
}
