# Dein Lebenslauf-Builder

## Was ist das?

Ein kleines Programm, das aus einer einfachen Textdatei (`cv.yaml`) automatisch einen professionellen Lebenslauf als PDF erzeugt. Du bearbeitest nur die YAML-Datei — das Layout, die Schriften, die Farben macht alles das Programm.

## Wie sind wir da hingekommen?

### Das Problem

Du brauchst einen Lebenslauf für deine Bewerbungen fürs Duale Studium. Man könnte den in Word machen, aber:

- Jedes Mal wenn du was änderst, verrutscht das Layout
- Du hast keine Versionierung (welche Version hast du an welche Firma geschickt?)
- Es sieht meistens nicht wirklich professionell aus

### Die Idee

Wir trennen **Inhalt** und **Design**:

- **Inhalt** = deine Daten in einer einfachen Textdatei (`cv.yaml`)
- **Design** = ein professionelles Template das automatisch angewendet wird

Das ist ein Grundprinzip in der Softwareentwicklung: *Separation of Concerns* — trenne Dinge die sich unabhängig voneinander ändern.

### Die Technologie-Entscheidungen

**YAML** statt Word/PDF direkt bearbeiten:
YAML ist ein Textformat das Menschen gut lesen können. Deine Daten sehen so aus:

```yaml
personal:
  firstname: "Merle"
  lastname: "Stücker"
  email: "merle.stuecker@gmail.com"
```

Keine komplizierten Menüs, keine versteckten Formatierungen. Nur deine Daten.

**Typst** statt LaTeX für die PDF-Erzeugung:
Typst ist eine moderne Alternative zu LaTeX. LaTeX kennst du schon von deiner Projektarbeit (Overleaf). Typst ist einfacher, schneller, und für einen Lebenslauf genauso gut. Es kompiliert in Millisekunden statt Sekunden.

**Node.js / TypeScript** als Programmiersprache:
Das Build-Script das dein YAML liest und daraus die Typst-Datei erzeugt ist in TypeScript geschrieben. TypeScript ist JavaScript mit Typen — eine der meistgenutzten Sprachen in der Webentwicklung.

**neat-cv** als Template:
Wir haben mehrere fertige CV-Templates verglichen (neat-cv, toy-cv, modern-cv, metronic). neat-cv hat am besten gepasst: Sidebar mit Foto, Sprachbalken, sauberes Design.

## Wie funktioniert der Build-Prozess?

```
cv.yaml  →  TypeScript-Script  →  Typst-Datei  →  Typst-Compiler  →  cv.pdf
(deine      (generate-typst.ts)   (generiert)     (typst compile)    (fertig!)
 Daten)
```

1. Du bearbeitest `cv.yaml`
2. Das Script liest deine Daten und erzeugt daraus Typst-Code
3. Der Typst-Compiler macht daraus ein PDF
4. Das PDF liegt in `output/cv.pdf`

## Git und GitHub

### Was ist Git?

Git ist ein **Versionskontrollsystem**. Es merkt sich jede Änderung die du an deinen Dateien machst. Wie "Änderungen nachverfolgen" in Word, aber viel mächtiger:

- Du kannst jederzeit zu einer alten Version zurückgehen
- Du siehst genau was sich wann geändert hat
- Mehrere Leute können gleichzeitig an denselben Dateien arbeiten

Jede Änderung die du speicherst heißt **Commit**. Ein Commit ist wie ein Foto deines Projekts zu einem bestimmten Zeitpunkt, mit einer kurzen Beschreibung was sich geändert hat.

### Was ist GitHub?

GitHub ist eine Website die deine Git-Repositories (= Projektordner) online speichert. Das hat mehrere Vorteile:

- **Backup** — dein Code ist nicht nur auf deinem Computer
- **Zusammenarbeit** — andere können deinen Code sehen und mitarbeiten
- **GitHub Actions** — automatische Aufgaben die bei jeder Änderung laufen

### Was sind GitHub Actions?

GitHub Actions ist ein Dienst der automatisch Programme ausführt wenn du Änderungen hochlädst (pushst). In unserem Fall:

1. Du änderst `cv.yaml` und pushst nach GitHub
2. GitHub bemerkt die Änderung und startet automatisch einen **Workflow**
3. Der Workflow installiert Typst und Node.js auf einem GitHub-Server
4. Er kompiliert dein PDF
5. Das fertige PDF kannst du unter "Actions" → "Artifacts" herunterladen

Die Workflow-Datei (`.github/workflows/build-cv.yml`) beschreibt diese Schritte. Du kannst sie dir anschauen — sie ist auch nur eine YAML-Datei.

Das Ganze ist **kostenlos** auf GitHub Free.

## Wie benutze ich das?

### Lokal (auf deinem Computer)

```bash
# Einmalig: Node.js und Typst installieren
brew install typst
brew install node

# Im lebenslauf-Ordner:
npm install              # Abhängigkeiten installieren (einmalig)
npm run cv build         # PDF erzeugen
open output/cv.pdf       # PDF anschauen
```

### Über GitHub (ohne lokale Installation)

1. Geh auf github.com zu diesem Repository
2. Klick auf `lebenslauf/cv.yaml`
3. Klick auf den Stift (Edit) oben rechts
4. Ändere deine Daten
5. Klick "Commit changes"
6. Warte ~30 Sekunden
7. Geh auf "Actions" → klick auf den neuesten Workflow-Run → "cv-pdf" herunterladen

## Was du daraus lernen kannst

Dieses kleine Projekt benutzt echte Software-Engineering-Konzepte:

- **Versionskontrolle** mit Git
- **CI/CD** (Continuous Integration) mit GitHub Actions
- **Daten/Logik-Trennung** (YAML vs. Template)
- **Build-Pipelines** (YAML → Typst → PDF)
- **Package Management** mit npm
- **Typsicherheit** mit TypeScript

Das sind alles Dinge die dir im Dualen Studium Informatik begegnen werden.
