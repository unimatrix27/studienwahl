import { writeFileSync, existsSync } from "fs";

const EXAMPLE_CV = `# Lebenslauf / CV
# Edit this file with your personal data

personal:
  name: "Maria Mustermann"
  address: "Musterstraße 1, 12345 Berlin"
  email: "maria@example.com"
  phone: "+49 170 1234567"
  birthdate: "2007-05-15"
  birthplace: "Berlin"
  # photo: "photo.jpg"  # optional — place photo file next to this YAML

education:
  - institution: "Gymnasium Musterstadt"
    degree: "Abitur"
    period: "2019 - 2026"
    grade: "1.8"
    focus:
      - "Mathematik"
      - "Informatik"
    details:
      - "Teilnahme am Bundeswettbewerb Informatik"
      - "Mitglied der Mathe-AG"

skills:
  languages:
    - name: "Deutsch"
      level: "Muttersprache"
    - name: "Englisch"
      level: "Fließend"
    - name: "Französisch"
      level: "Grundkenntnisse"
  technical:
    - "Python"
    - "HTML/CSS"
    - "JavaScript"
    - "Microsoft Office"
    - "Git"
  soft:
    - "Teamarbeit"
    - "Analytisches Denken"
    - "Eigeninitiative"
    - "Zuverlässigkeit"

experience:
  - title: "Schülerpraktikum"
    company: "Tech GmbH"
    period: "03/2025"
    tasks:
      - "Unterstützung bei der Webentwicklung"
      - "Testen von Software-Anwendungen"
      - "Dokumentation technischer Abläufe"
  - title: "Ferienjob"
    company: "Buchhandlung Schmidt"
    period: "07/2024 - 08/2024"
    tasks:
      - "Kundenberatung und Verkauf"
      - "Warenpflege und Inventur"

interests:
  - "Programmieren"
  - "Robotik"
  - "Schach"
  - "Volleyball"
`;

export function initCv(outputPath: string): void {
  if (existsSync(outputPath)) {
    console.error(`File already exists: ${outputPath}`);
    console.error("Remove it first or choose a different name.");
    process.exit(1);
  }
  writeFileSync(outputPath, EXAMPLE_CV);
  console.log(`Created example CV: ${outputPath}`);
  console.log("Edit it with your data, then run: cv build");
}
