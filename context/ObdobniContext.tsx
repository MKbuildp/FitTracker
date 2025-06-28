import React, { createContext, useContext, useState, ReactNode } from 'react';

/** Stav období - pouze měsíční */
export interface ObdobniStav {
  datum: Date; // Reprezentuje vybraný měsíc
}

/** Kontext pro správu období */
interface ObdobniKontextTyp {
  globalniObdobi: ObdobniStav;
  setGlobalniObdobi: (obdobi: ObdobniStav) => void;
  navigovatObdobi: (smer: 'predchozi' | 'dalsi') => void;
  resetNaAktualniObdobi: () => void;
}

/** Výchozí hodnoty kontextu */
const vychoziObdobi: ObdobniStav = {
  datum: new Date(),
};

const ObdobniKontext = createContext<ObdobniKontextTyp | undefined>(undefined);

/** Provider pro kontext období */
export const ObdobniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalniObdobi, setGlobalniObdobi] = useState<ObdobniStav>(vychoziObdobi);

  /** Navigace na předchozí/další měsíc */
  const navigovatObdobi = (smer: 'predchozi' | 'dalsi') => {
    const noveDatum = new Date(globalniObdobi.datum);
    
    if (smer === 'predchozi') {
      noveDatum.setMonth(noveDatum.getMonth() - 1);
    } else {
      noveDatum.setMonth(noveDatum.getMonth() + 1);
    }

    setGlobalniObdobi({
      datum: noveDatum,
    });
  };

  /** Reset na aktuální měsíc */
  const resetNaAktualniObdobi = () => {
    setGlobalniObdobi({
      datum: new Date(),
    });
  };

  const hodnota: ObdobniKontextTyp = {
    globalniObdobi,
    setGlobalniObdobi,
    navigovatObdobi,
    resetNaAktualniObdobi,
  };

  return (
    <ObdobniKontext.Provider value={hodnota}>
      {children}
    </ObdobniKontext.Provider>
  );
};

/** Hook pro použití kontextu období */
export const useObdobniContext = (): ObdobniKontextTyp => {
  const kontext = useContext(ObdobniKontext);
  if (kontext === undefined) {
    throw new Error('useObdobniContext musí být použit v rámci ObdobniProvider');
  }
  return kontext;
}; 