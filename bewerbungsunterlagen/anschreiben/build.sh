#!/bin/bash
# Baut ein Anschreiben-PDF aus brief.tex + ## Anschreiben im Unternehmensfile
#
# Verwendung: ./build.sh biotronik
#   -> liest unternehmen/biotronik.md, ersetzt Platzhalter, erzeugt biotronik.pdf

set -e

if [ -z "$1" ]; then
  echo "Verwendung: ./build.sh <unternehmen>"
  echo "Beispiel:   ./build.sh biotronik"
  echo ""
  echo "Unternehmen mit Anschreiben-Abschnitt:"
  grep -rl "^## Anschreiben" "$(dirname "$0")/../../unternehmen/" 2>/dev/null | while read f; do
    basename "$f" .md
  done
  exit 1
fi

dir="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$dir/../.." && pwd)"
name="$1"
mdfile="$repo/unternehmen/${name}.md"
template="$dir/brief.tex"
output="$dir/${name}.tex"

if [ ! -f "$mdfile" ]; then
  echo "Fehler: $mdfile nicht gefunden"
  exit 1
fi

# Alles in perl: Felder aus md extrahieren und in tex ersetzen
perl -e '
  # Markdown lesen, Anschreiben-Abschnitt extrahieren
  open my $md, "<", $ARGV[0] or die "Kann $ARGV[0] nicht öffnen: $!";
  my $in_section = 0;
  my %fields;
  while (<$md>) {
    if (/^## Anschreiben/) { $in_section = 1; next; }
    if ($in_section && /^## /) { last; }
    if ($in_section && /^- \*\*(.+?):\*\*\s*(.*)/) {
      $fields{$1} = $2;
    }
  }
  close $md;

  die "Kein ## Anschreiben Abschnitt gefunden\n" unless %fields;

  # Template lesen
  open my $tpl, "<", $ARGV[1] or die "Kann $ARGV[1] nicht öffnen: $!";
  my $tex = do { local $/; <$tpl> };
  close $tpl;

  # Platzhalter ersetzen
  my %map = (
    "EMPFAENGER" => $fields{"Empfänger"} // "",
    "BETREFF" => $fields{"Betreff"} // "",
    "ANREDE" => $fields{"Anrede"} // "",
    "ABSATZ_UNTERNEHMEN" => $fields{"Absatz"} // "",
  );

  for my $key (keys %map) {
    my $val = $map{$key};
    $tex =~ s/\{\{$key\}\}/$val/g;
  }

  # Ausgabe schreiben
  open my $out, ">", $ARGV[2] or die "Kann $ARGV[2] nicht öffnen: $!";
  print $out $tex;
  close $out;
' "$mdfile" "$template" "$output"

# PDF bauen
cd "$dir"
lualatex -interaction=nonstopmode "$output"

# Aufräumen
rm -f "${name}.aux" "${name}.log"

echo ""
echo "=> ${name}.pdf erstellt"
