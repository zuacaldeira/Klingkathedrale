export const SETS = {
  peaceful_beauty: {
    works: [
      { bwv: 'BWV 1068', title: 'Air aus der Orchestersuite Nr. 3 in D-Dur' },
      { bwv: 'BWV 988', title: 'Goldberg-Variationen — Aria' },
      { bwv: 'BWV 147', title: 'Jesu, bleibet meine Freude' }
    ]
  },
  peaceful_depth: {
    works: [
      { bwv: 'BWV 232', title: 'H-Moll-Messe — Et incarnatus est' },
      { bwv: 'BWV 639', title: 'Ich ruf zu dir, Herr Jesu Christ' },
      { bwv: 'BWV 1007', title: 'Suite Nr. 1 für Violoncello solo — Prélude' }
    ]
  },
  energized_drama: {
    works: [
      { bwv: 'BWV 565', title: 'Toccata und Fuge in d-Moll' },
      { bwv: 'BWV 1052', title: 'Cembalokonzert Nr. 1 in d-Moll' },
      { bwv: 'BWV 244', title: 'Matthäus-Passion — Eröffnungschor' }
    ]
  },
  energized_virtuosity: {
    works: [
      { bwv: 'BWV 1046-1051', title: 'Brandenburgische Konzerte' },
      { bwv: 'BWV 1001', title: 'Sonate Nr. 1 für Violine solo — Fuga' },
      { bwv: 'BWV 903', title: 'Chromatische Fantasie und Fuge in d-Moll' }
    ]
  },
  contemplative_depth: {
    works: [
      { bwv: 'BWV 244', title: 'Matthäus-Passion — Erbarme dich' },
      { bwv: 'BWV 1080', title: 'Die Kunst der Fuge — Contrapunctus XIV' },
      { bwv: 'BWV 82', title: 'Ich habe genug — Kantate' }
    ]
  },
  sad_stillness: {
    works: [
      { bwv: 'BWV 245', title: 'Johannes-Passion — Es ist vollbracht' },
      { bwv: 'BWV 478', title: 'Komm, süßer Tod' },
      { bwv: 'BWV 4', title: 'Christ lag in Todesbanden' }
    ]
  },
  curious_beauty: {
    works: [
      { bwv: 'BWV 248', title: 'Weihnachtsoratorium — Jauchzet, frohlocket!' },
      { bwv: 'BWV 846', title: 'Wohltemperiertes Klavier I — Präludium in C-Dur' },
      { bwv: 'BWV 1066', title: 'Orchestersuite Nr. 1 in C-Dur' }
    ]
  },
  curious_virtuosity: {
    works: [
      { bwv: 'BWV 1048', title: 'Brandenburgisches Konzert Nr. 3 in G-Dur' },
      { bwv: 'BWV 578', title: 'Fuge in g-Moll (Kleine Fuge)' },
      { bwv: 'BWV 971', title: 'Italienisches Konzert in F-Dur' }
    ]
  },
  sad_beauty: {
    works: [
      { bwv: 'BWV 106', title: 'Gottes Zeit ist die allerbeste Zeit' },
      { bwv: 'BWV 1068', title: 'Air aus der Orchestersuite Nr. 3' },
      { bwv: 'BWV 12', title: 'Weinen, Klagen, Sorgen, Zagen' }
    ]
  },
  contemplative_stillness: {
    works: [
      { bwv: 'BWV 639', title: 'Ich ruf zu dir, Herr Jesu Christ' },
      { bwv: 'BWV 659', title: 'Nun komm der Heiden Heiland (Orgel)' },
      { bwv: 'BWV 988', title: 'Goldberg-Variationen — Variation 25' }
    ]
  }
};

// Aliases
SETS.peaceful_stillness = SETS.contemplative_stillness;
SETS.peaceful_drama = SETS.energized_drama;
SETS.peaceful_virtuosity = SETS.curious_virtuosity;
SETS.energized_beauty = SETS.curious_beauty;
SETS.energized_depth = SETS.contemplative_depth;
SETS.energized_stillness = SETS.peaceful_beauty;
SETS.contemplative_beauty = SETS.peaceful_beauty;
SETS.contemplative_drama = SETS.energized_drama;
SETS.contemplative_virtuosity = SETS.curious_virtuosity;
SETS.sad_drama = SETS.energized_drama;
SETS.sad_depth = SETS.contemplative_depth;
SETS.sad_virtuosity = SETS.curious_virtuosity;
SETS.curious_depth = SETS.contemplative_depth;
SETS.curious_drama = SETS.energized_drama;
SETS.curious_stillness = SETS.contemplative_stillness;

export function getSetKey(mood, aesthetic) {
  const key = mood + '_' + aesthetic;
  return SETS[key] ? key : 'peaceful_beauty';
}
