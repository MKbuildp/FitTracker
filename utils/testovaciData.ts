import { Cviceni, ZaznamVykonu } from '../types';

/**
 * Testovací data pro screenshoty obchodů
 * Červen 2025 - realistická data s různými úrovněmi pokroku
 */

// Běžná cvičení pro Opakování
const opakovaciCviceni: Cviceni[] = [
  {
    id: 'kliky-test',
    nazev: 'Kliky',
    typMereni: 'opakovani',
    smerovani: 'kratsi_lepsi',
    vytvorenoKdy: new Date('2025-05-15'),
    maNastavenCil: true,
    denniCil: 50,
    barva: '#ef4444', // Červená
  },
  {
    id: 'drepy-test',
    nazev: 'Dřepy',
    typMereni: 'opakovani',
    smerovani: 'kratsi_lepsi',
    vytvorenoKdy: new Date('2025-05-20'),
    maNastavenCil: true,
    denniCil: 30,
    barva: '#10b981', // Zelená
  },
  {
    id: 'bricho-test',
    nazev: 'Břicho',
    typMereni: 'opakovani',
    smerovani: 'kratsi_lepsi',
    vytvorenoKdy: new Date('2025-05-25'),
    maNastavenCil: true,
    denniCil: 40,
    barva: '#3b82f6', // Modrá
  },
];

// Běžná cvičení pro Časovky
const casovaCviceni: Cviceni[] = [
  {
    id: 'beh-test',
    nazev: 'Běh',
    typMereni: 'cas',
    smerovani: 'delsi_lepsi',
    vytvorenoKdy: new Date('2025-05-10'),
    maNastavenCil: true,
    denniCil: 1800, // 30 minut
    barva: '#f59e0b', // Oranžová
  },
  {
    id: 'plank-test',
    nazev: 'Plank',
    typMereni: 'cas',
    smerovani: 'delsi_lepsi',
    vytvorenoKdy: new Date('2025-05-18'),
    maNastavenCil: true,
    denniCil: 300, // 5 minut
    barva: '#8b5cf6', // Fialová
  },
  {
    id: 'cyklistika-test',
    nazev: 'Cyklistika',
    typMereni: 'cas',
    smerovani: 'delsi_lepsi',
    vytvorenoKdy: new Date('2025-05-22'),
    maNastavenCil: true,
    denniCil: 2400, // 40 minut
    barva: '#06b6d4', // Azurová
  },
];

// Generování dat za červen 2025
function generovatZaznamyZaCerven(): ZaznamVykonu[] {
  const zaznamy: ZaznamVykonu[] = [];
  const vsechnaCviceni = [...opakovaciCviceni, ...casovaCviceni];
  
  // Červen 2025 má 30 dní
  for (let den = 1; den <= 30; den++) {
    const datum = new Date(2025, 5, den); // Červen je měsíc 5 (0-indexed)
    
    // Některé dny budou prázdné (realismus)
    if (Math.random() < 0.15) continue; // 15% šance na prázdný den
    
    // Pro každé cvičení
    vsechnaCviceni.forEach((cviceni, index) => {
      // Některá cvičení nebudou každý den
      if (Math.random() < 0.7) return; // 70% šance na cvičení
      
      let hodnota: number;
      
      if (cviceni.typMereni === 'opakovani') {
        // Opakování - různé úrovně pokroku
        const baseValue = cviceni.denniCil;
        const variation = Math.random() * 0.4 - 0.2; // ±20% variace
        hodnota = Math.round(baseValue * (0.6 + variation)); // 40-80% cíle
      } else {
        // Čas - různé úrovně pokroku
        const baseValue = cviceni.denniCil;
        const variation = Math.random() * 0.4 - 0.2; // ±20% variace
        hodnota = Math.round(baseValue * (0.5 + variation)); // 30-70% cíle
      }
      
      // Některé dny budou mít 100% pokrok
      if (Math.random() < 0.3) { // 30% šance na 100%
        hodnota = cviceni.denniCil;
      }
      
      // Některé dny budou mít velmi nízký pokrok
      if (Math.random() < 0.1) { // 10% šance na nízký pokrok
        hodnota = Math.round(cviceni.denniCil * 0.2);
      }
      
      zaznamy.push({
        id: `zaznam-${cviceni.id}-${den}`,
        cviceniId: cviceni.id,
        datumCas: datum,
        hodnota: Math.max(1, hodnota), // Minimálně 1
      });
    });
  }
  
  return zaznamy;
}

// Exportované testovací data
export const testovaciData = {
  cviceni: [...opakovaciCviceni, ...casovaCviceni],
  zaznamy: generovatZaznamyZaCerven(),
  
  // Funkce pro reset na testovací data
  async nacistTestovaciData(): Promise<void> {
    const { ukladaniDat } = await import('./ukladaniDat');
    
    await ukladaniDat.ulozitCviceni(this.cviceni);
    await ukladaniDat.ulozitZaznamy(this.zaznamy);
    
    console.log('✅ Testovací data načtena!');
    console.log(`📊 ${this.cviceni.length} cvičení`);
    console.log(`📈 ${this.zaznamy.length} záznamů za červen 2025`);
  },
  
  // Funkce pro smazání testovacích dat
  async smazatTestovaciData(): Promise<void> {
    const { ukladaniDat } = await import('./ukladaniDat');
    
    await ukladaniDat.vymazatVsechnaData();
    
    console.log('🗑️ Testovací data smazána!');
  }
};


