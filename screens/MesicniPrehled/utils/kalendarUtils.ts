/**
 * Vrátí první den měsíce
 */
export const getZacatekMesice = (datum: Date): Date => {
  const novyDatum = new Date(datum);
  novyDatum.setDate(1);
  return novyDatum;
};

/**
 * Vrátí poslední den měsíce
 */
export const getKonecMesice = (datum: Date): Date => {
  const novyDatum = new Date(datum);
  novyDatum.setMonth(novyDatum.getMonth() + 1);
  novyDatum.setDate(0);
  return novyDatum;
};

/**
 * Vrátí pole všech dnů v měsíci s prázdnými místy na začátku pro správné zarovnání dnů v týdnu
 */
export const getDnyMesice = (datum: Date): (Date | null)[] => {
  const zacatekMesice = getZacatekMesice(datum);
  const konecMesice = getKonecMesice(datum);
  const dny: (Date | null)[] = [];

  // Přidáme prázdná místa na začátek podle dne v týdnu
  let prvniDenTydne = zacatekMesice.getDay(); // 0 = neděle, 1 = pondělí, ...
  if (prvniDenTydne === 0) prvniDenTydne = 7; // Převedeme neděli na 7
  for (let i = 1; i < prvniDenTydne; i++) {
    dny.push(null);
  }

  // Vygenerujeme dny aktuálního měsíce
  const aktualniDen = new Date(zacatekMesice);
  while (aktualniDen <= konecMesice) {
    dny.push(new Date(aktualniDen));
    aktualniDen.setDate(aktualniDen.getDate() + 1);
  }

  return dny;
};
