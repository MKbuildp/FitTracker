/** Kontrola, zda je datum dnes */
export const jeDnes = (datum: Date): boolean => {
  const dnes = new Date();
  return datum.getDate() === dnes.getDate() &&
         datum.getMonth() === dnes.getMonth() &&
         datum.getFullYear() === dnes.getFullYear();
}; 