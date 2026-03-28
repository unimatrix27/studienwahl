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
  hobbies?: CvEntry[];
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
        `  ${escapeTypst(l.name)}: ${escapeTypst(l.label)} \\`
    )
    .join("\n");

  const itSkillsList = data.it_skills
    .map((s) => `    "${escapeTypst(s)}",`)
    .join("\n");

  const strengthsList = data.strengths
    .map((s) => `    "${escapeTypst(s)}",`)
    .join("\n");

  const interestsList = data.interests
    .map((s) => `    "${escapeTypst(s)}",`)
    .join("\n");

  const photoLine = ""; // photo is inserted manually in the sidebar to avoid neat-cv's circular clipping

  return `#import "@preview/neat-cv:0.7.0": cv, side, item-with-level, item-pills, contact-info, social-links
#import "@preview/fontawesome:0.6.0": fa-icon

#set text(lang: "de")

// Custom entry with darker dates and top alignment
#let entry(
  title: none,
  date: "",
  institution: "",
  location: "",
  description,
) = {
  block(above: 1em, below: 0.65em)[
    #grid(
      columns: (5.7em, auto),
      align: (right + top, left + top),
      column-gutter: .8em,
      [
        #v(-0.25em)
        #text(size: 0.85em, fill: rgb("#555555"), top-edge: "cap-height", date)
      ],
      [
        #set text(size: 0.85em, top-edge: "cap-height")
        #text(weight: "semibold", title)

        #text(size: 0.9em, smallcaps([
          #if institution != "" or location != "" [
            #institution
            #h(1fr)
            #if location != "" [
              #fa-icon("location-dot", size: 0.85em, fill: rgb("#2563eb"))
              #location
            ]
          ]
        ]))

        #text(size: 0.9em, description)
      ],
    )
  ]
}

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
  body-font-size: 12pt,
  side-width: 4.8cm,
  date: auto,
)

#side[
  #set text(size: 1.11em)
${p.photo ? `  #v(-1.8cm)
  #align(center)[
    #box(
      fill: white,
      inset: 4pt,
      stroke: 0.5pt + rgb("#999999"),
    )[
      #box(clip: true, width: 3.5cm)[
        #move(dx: -12%, image("${escapeTypst(p.photo)}", width: 125%))
      ]
    ]
  ]
  #v(0.3cm)
` : ""}  = Persönliche Daten
  Geburtsdatum: ${p.birthdate} \\
  Geburtsort: ${p.birthplace}

  = Kontakt
  #contact-info()

  = Sprachen
${languageLines}

  = IT-Kenntnisse
  #item-pills((
${itSkillsList}
  ))

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
${data.hobbies && data.hobbies.length > 0 ? `
= Hobbies & Engagement

${generateEntries(data.hobbies)}` : ""}
`;
}
