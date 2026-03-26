// Modern two-column CV template
// Designed for Duales Studium applications

#let accent = rgb("#2563eb")
#let accent-light = rgb("#dbeafe")
#let text-dark = rgb("#1e293b")
#let text-muted = rgb("#64748b")
#let divider-color = rgb("#e2e8f0")

#let cv-data = json("cv-data.json")
#let personal = cv-data.personal
#let education = cv-data.education
#let skills = cv-data.skills
#let experience = cv-data.at("experience", default: ())
#let interests = cv-data.at("interests", default: ())

#set document(title: "Lebenslauf – " + personal.name, author: personal.name)
#set page(paper: "a4", margin: (top: 1.5cm, bottom: 1.5cm, left: 1.5cm, right: 1.5cm))
#set text(font: "Helvetica Neue", size: 9.5pt, fill: text-dark)
#set par(leading: 0.6em)

// Helper functions
#let section-title(title) = {
  v(0.4cm)
  text(size: 12pt, weight: "bold", fill: accent)[#title]
  v(0.15cm)
  line(length: 100%, stroke: 1.5pt + accent)
  v(0.2cm)
}

#let sidebar-section(title) = {
  v(0.3cm)
  text(size: 10pt, weight: "bold", fill: white)[#title]
  v(0.1cm)
  line(length: 100%, stroke: 0.8pt + rgb("#ffffff80"))
  v(0.15cm)
}

#let skill-pill(content) = {
  box(
    fill: rgb("#ffffff20"),
    radius: 3pt,
    inset: (x: 6pt, y: 3pt),
    text(size: 8pt, fill: white)[#content]
  )
}

#let level-dots(level) = {
  let n = if level == "Muttersprache" or level == "Native" { 5 }
    else if level == "Fließend" or level == "Fluent" or level == "C2" or level == "C1" { 4 }
    else if level == "Gut" or level == "Good" or level == "B2" { 3 }
    else if level == "Grundkenntnisse" or level == "Basic" or level == "B1" or level == "A2" { 2 }
    else { 1 }
  for i in range(5) {
    if i < n {
      box(circle(radius: 3pt, fill: white))
    } else {
      box(circle(radius: 3pt, fill: rgb("#ffffff40")))
    }
    h(2pt)
  }
}

// Layout: sidebar + main content
#grid(
  columns: (6.5cm, 1fr),
  gutter: 0cm,

  // ===== LEFT SIDEBAR =====
  rect(
    width: 100%,
    fill: accent,
    radius: (top-left: 0pt, bottom-left: 0pt),
    inset: (x: 0.8cm, y: 1cm),
  )[
    #set text(fill: white)

    // Photo (if available)
    #if personal.at("photo", default: none) != none {
      align(center)[
        #box(
          clip: true,
          radius: 50%,
          width: 4cm,
          height: 4cm,
          image(personal.photo, width: 4cm)
        )
      ]
      v(0.4cm)
    }

    // Name
    #align(center)[
      #text(size: 18pt, weight: "bold")[#personal.name]
    ]

    // Contact
    #sidebar-section("Kontakt")
    #set text(size: 8.5pt)

    #grid(
      columns: (auto, 1fr),
      gutter: 0.3cm,
      text(weight: "bold")[Adresse:], personal.address,
      text(weight: "bold")[E-Mail:], personal.email,
      text(weight: "bold")[Telefon:], personal.phone,
      text(weight: "bold")[Geb.-Datum:], personal.birthdate,
      ..if personal.at("birthplace", default: none) != none {
        (text(weight: "bold")[Geb.-Ort:], personal.birthplace)
      }
    )

    // Languages
    #sidebar-section("Sprachen")
    #for lang in skills.languages {
      grid(
        columns: (1fr, auto),
        text(size: 8.5pt)[#lang.name],
        level-dots(lang.level),
      )
      v(0.1cm)
      text(size: 7.5pt, fill: rgb("#ffffffb0"))[#lang.level]
      v(0.15cm)
    }

    // Technical skills
    #if skills.at("technical", default: none) != none {
      sidebar-section("IT-Kenntnisse")
      for skill in skills.technical {
        skill-pill(skill)
        h(3pt)
      }
    }

    // Soft skills
    #if skills.at("soft", default: none) != none {
      sidebar-section("Stärken")
      for skill in skills.soft {
        skill-pill(skill)
        h(3pt)
      }
    }

    // Interests
    #if interests.len() > 0 {
      sidebar-section("Interessen")
      for interest in interests {
        skill-pill(interest)
        h(3pt)
      }
    }
  ],

  // ===== MAIN CONTENT =====
  pad(left: 0.8cm)[

    // Header
    text(size: 24pt, weight: "bold", fill: accent)[Lebenslauf]
    v(0.1cm)

    // Education
    #section-title("Bildungsweg")
    #for edu in education {
      grid(
        columns: (1fr, auto),
        [
          #text(weight: "bold", size: 10pt)[#edu.institution] \
          #text(fill: text-muted)[#edu.degree
            #if edu.at("grade", default: none) != none [ — Note: #edu.grade]]
        ],
        align(right, text(size: 8.5pt, fill: text-muted)[#edu.period])
      )
      if edu.at("focus", default: none) != none {
        v(0.1cm)
        text(size: 8.5pt)[*Schwerpunkte:* #edu.focus.join(", ")]
      }
      if edu.at("details", default: none) != none {
        v(0.1cm)
        for detail in edu.details {
          text(size: 8.5pt)[• #detail]
          linebreak()
        }
      }
      v(0.3cm)
    }

    // Experience
    #if experience.len() > 0 {
      section-title("Berufserfahrung")
      for exp in experience {
        grid(
          columns: (1fr, auto),
          [
            #text(weight: "bold", size: 10pt)[#exp.title] \
            #text(fill: text-muted)[#exp.company]
          ],
          align(right, text(size: 8.5pt, fill: text-muted)[#exp.period])
        )
        if exp.at("tasks", default: none) != none {
          v(0.1cm)
          for task in exp.tasks {
            text(size: 8.5pt)[• #task]
            linebreak()
          }
        }
        v(0.3cm)
      }
    }
  ]
)
