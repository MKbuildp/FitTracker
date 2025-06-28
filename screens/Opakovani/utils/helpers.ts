/** Zjistí, zda je datum dnes */
export const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return (
    datum.getDate() === dnes.getDate() &&
    datum.getMonth() === dnes.getMonth() &&
    datum.getFullYear() === dnes.getFullYear()
  );
};

/** Formátuje sekundy na MM:SS */
export const formatovatCas = (sekundy: number): string => {
  const minuty = Math.floor(sekundy / 60);
  const zbyvajiciSekundy = sekundy % 60;
  return `${String(minuty).padStart(2, '0')}:${String(zbyvajiciSekundy).padStart(2, '0')}`;
};

/** Formátuje hodnotu (opakování nebo čas) */
export const formatovatHodnotu = (hodnota: number, typ: 'opakovani' | 'cas'): string => {
  if (typ === 'opakovani') return hodnota.toString();
  return formatovatCas(hodnota);
}; 