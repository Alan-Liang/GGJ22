export const music = {
  // Omnipotent Youth Society - The Cable Temple
  THE_CABLE_TEMPLE: `
A3 4n
G3 4n
E3 8n.
B3 16n
A3 2n
 4n
E4 4n
D4 4n
B3 8n.
D4 16n
B3 2n`,
  // 遠い日の歌
  TOIHINOUTA: `
E4 8n
F4 8n
G4 8n
A4 16n
G4 8n.
 4n
G4 8n
C5 4n
C5 16n
E4 8n.
G4 4n`,
  // Don McLean - American Pie
  AMERICAN_PIE: `
G3 8n
G4 4n
F4 8n
F4 16n
E4 16n
E4 16n
D4 16n
C4 16n
D4 8n.`,
  // Beyond - Boundless Oceans, Vast Skies
  BOUNDLESS_OCEANS_VAST_SKIES: `
D4 8n
C4 8n
C4 4n.
C4 8n
F3 8n
 8n
A3 8n
A#3 8n
A3 8n
G3 8n
G3 16n
A3 8n.
G3 8n`,
}

for (const key in music) {
  music[key] = music[key]
    .split('\n')
    .filter(Boolean)
    .map(x => x.split(' '))
    .map(([ note, duration ]) => ({ note, duration }))
  music[key].name = key
}
