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
D4 8n.
B3 16n
B3 2n`,
}

for (const key in music) {
  music[key] = music[key]
    .split('\n')
    .filter(Boolean)
    .map(x => x.split(' '))
    .map(([ note, duration ]) => ({ note, duration }))
}
