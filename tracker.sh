#!/bin/bash
# Bewerbungs-Tracker: generiert tracker.html aus den ## Bewerbung-Abschnitten

dir="$(dirname "$0")/unternehmen"
out="$(dirname "$0")/tracker.html"

# Daten sammeln
rows=""
all_todos=""
for file in "$dir"/*.md; do
  grep -q "^## Bewerbung" "$file" || continue

  slug=$(basename "$file" .md)
  name=$(echo "$slug" | tr '-' ' ' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')

  bew_section=$(awk '/^## Bewerbung/{found=1; next} /^## /{if(found) exit} found' "$file")
  field() { echo "$bew_section" | grep "^\- \*\*$1:\*\*" | sed 's/.*\*\* *//' ; }

  status=$(field Status)
  start=$(field Studienstart)
  datum=$(field "Datum Bewerbung")
  frist=$(field Frist)
  notizen=$(field Notizen)

  # Links aus ## Links Abschnitt
  links_html=""
  while IFS= read -r line; do
    label=$(echo "$line" | sed 's/^- \*\*\(.*\):\*\*.*/\1/')
    url=$(echo "$line" | grep -o 'https://[^ )*]*')
    [ -n "$url" ] && links_html+="<a href=\"${url}\" title=\"${label}\">${label}</a> "
  done < <(awk '/^## Links/{found=1; next} /^## /{if(found) exit} found' "$file" | grep '^\- \*\*.*https://')

  # TODOs aus ## TODOs Abschnitt
  todos_html=""
  while IFS= read -r line; do
    text=$(echo "$line" | sed 's/^- \[ \] //')
    done_class=""
    if echo "$line" | grep -q '^\- \[x\]'; then
      text=$(echo "$line" | sed 's/^- \[x\] //')
      done_class=" class=\"done\""
    fi
    todos_html+="<li${done_class}>${text}</li>"
    # Offene TODOs zur Gesamtliste
    if echo "$line" | grep -q '^\- \[ \]'; then
      all_todos+="<li><strong>${name}:</strong> ${text}</li>"
    fi
  done < <(awk '/^## TODOs/{found=1; next} /^## /{if(found) exit} found' "$file" | grep '^\- \[')

  # Status-Farbe
  case "$status" in
    Recherche)  color="#6b7280" ;;
    Entwurf)    color="#f59e0b" ;;
    Abgeschickt) color="#3b82f6" ;;
    Einladung)  color="#8b5cf6" ;;
    Zusage)     color="#22c55e" ;;
    Absage)     color="#ef4444" ;;
    *)          color="#6b7280" ;;
  esac

  rows+="        <tr>
          <td><a href=\"unternehmen/${slug}.md\">${name}</a></td>
          <td><span class=\"badge\" style=\"background:${color}\">${status}</span></td>
          <td>${start}</td>
          <td>${datum}</td>
          <td>${frist}</td>
          <td class=\"links\">${links_html:-—}</td>
          <td>${todos_html:+<ul class=\"todos\">${todos_html}</ul>}</td>
          <td>${notizen}</td>
        </tr>
"
done

cat > "$out" <<'HEADER'
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bewerbungs-Tracker</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; max-width: 1400px; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin-bottom: .5rem; }
  h2 { font-size: 1.2rem; margin: 2rem 0 .75rem; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  th { background: #1e293b; color: #fff; text-align: left; padding: .75rem 1rem; font-weight: 600; font-size: .85rem; }
  td { padding: .75rem 1rem; border-bottom: 1px solid #e2e8f0; font-size: .9rem; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f1f5f9; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .badge { display: inline-block; padding: .2rem .6rem; border-radius: 9999px; color: #fff; font-size: .8rem; font-weight: 600; }
  .links a { display: inline-block; background: #e0e7ff; color: #3730a3; padding: .15rem .5rem; border-radius: 4px; font-size: .75rem; margin: .1rem .2rem; }
  .links a:hover { background: #c7d2fe; text-decoration: none; }
  .todos { list-style: none; padding: 0; margin: 0; }
  .todos li { padding: .15rem 0; font-size: .85rem; }
  .todos li::before { content: "\2610 "; color: #f59e0b; }
  .todos li.done { color: #94a3b8; text-decoration: line-through; }
  .todos li.done::before { content: "\2611 "; color: #22c55e; }
  .todo-list { background: #fff; border-radius: 8px; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,.1); margin-bottom: 2rem; }
  .todo-list ul { list-style: none; padding: 0; margin: 0; }
  .todo-list li { padding: .4rem 0; border-bottom: 1px solid #f1f5f9; font-size: .9rem; }
  .todo-list li:last-child { border-bottom: none; }
  .todo-list li::before { content: "\2610 "; color: #f59e0b; }
  .empty { color: #94a3b8; font-style: italic; text-align: center; padding: 2rem; }
  .no-todos { color: #94a3b8; font-style: italic; }
</style>
</head>
<body>
<h1>Bewerbungs-Tracker</h1>
HEADER

# TODO-Liste oben
if [ -n "$all_todos" ]; then
  cat >> "$out" <<TODOS
<h2>Offene TODOs</h2>
<div class="todo-list">
  <ul>
${all_todos}  </ul>
</div>
TODOS
else
  cat >> "$out" <<'NOTODOS'
<h2>Offene TODOs</h2>
<div class="todo-list"><p class="no-todos">Keine offenen TODOs</p></div>
NOTODOS
fi

# Tabelle
cat >> "$out" <<'TABLE'
<h2>Bewerbungen</h2>
<table>
  <thead>
    <tr>
      <th>Unternehmen</th>
      <th>Status</th>
      <th>Studienstart</th>
      <th>Bewerbung</th>
      <th>Frist</th>
      <th>Links</th>
      <th>TODOs</th>
      <th>Notizen</th>
    </tr>
  </thead>
  <tbody>
TABLE

if [ -z "$rows" ]; then
  echo '    <tr><td colspan="8" class="empty">Noch keine Bewerbungen</td></tr>' >> "$out"
else
  printf '%s' "$rows" >> "$out"
fi

cat >> "$out" <<'FOOTER'
  </tbody>
</table>
</body>
</html>
FOOTER

echo "tracker.html erstellt"
