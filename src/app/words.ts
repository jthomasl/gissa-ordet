// Svenska ord med exakt fem bokstäver
export const WORDS = [
  "stuga", "fågel", "musik", "drömt", "karta",
  "ljung", "skola", "morot", "björk", "glass",
  "kulor", "drake", "tiger", "panda", "snöre",
  "blixt", "dunge", "fjäll", "gryta", "halva",
  "juice", "linje", "nöjda", "räkna", "sköld",
  "tavla", "under", "värld", "åskan", "ärlig",
  "bonde", "cykel", "efter", "frysa", "hjälp",
  "idyll", "jämnt", "klart", "lunch", "opera",
  "punkt", "radio", "sänka", "total", "sport",
  "kraft", "ljusa", "djupa", "grupp", "huset",
  "orden", "saker", "vecka", "maska", "pärla",
  "rosor", "fikon", "krona", "penna", "lampa",
  "dimma", "fasan", "gräns", "höjda", "lever",
  "modig", "nålar", "runda", "stolt", "tunga",
  "flyga", "hylla", "ingår", "kvist", "lyfta",
  "möbel", "rösta", "skärp", "älska", "driva",
  "gilla", "hinna", "knipa", "blåsa", "dvärg",
  "tärna", "sömma", "gölen", "fälla", "hälla",
  "nåden", "plåga", "störa", "vända", "ödets",
  "bräda", "flöde", "gärna", "höger", "källa",
  "lätta", "märka", "nästa", "prova", "ränna",
  "ström", "trots", "väska", "änden", "börja",
  "dörre", "flyta", "glömt", "hutch", "jämra",
  "kämpa", "livet", "minne", "nöten", "pälsa",
  "röken", "sjöng", "trött", "ungen", "värma",
];

// Välj ett slumpmässigt ord
export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}
