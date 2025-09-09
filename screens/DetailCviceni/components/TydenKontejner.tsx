import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TydenKontejnerProps } from '../types/types';
import { ZaznamVykonu } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  getPocetAktivnichDni,
  getPocetDniVMesici,
  getPlneniCiluProcenta
} from '../../Prehled/utils/datumUtils';
import { responsiveComponents, responsiveTypography, responsiveSpacingValues } from '../../../src/styles/theme';


/** Komponenta pro zobrazení statistik a měsíčního přehledu cvičení */
export const TydenKontejner: React.FC<TydenKontejnerProps> = ({ zaznamy, cviceni, style, statistiky, formatovatHodnotu, vsechnaCviceni }) => {
  const { t } = useTranslation();

  // Filtrované záznamy pro aktuální týden
  const filtrovaneZaznamy = zaznamy.filter((z: ZaznamVykonu) => z.cviceniId === cviceni.id);
  
  // Přepočítané statistiky pro vybrané období
  const obdobiStatistiky = React.useMemo(() => {
    if (filtrovaneZaznamy.length === 0) {
      return {
        pocetZaznamu: 0,
        celkemHodnota: 0,
        nejlepsiVykon: 0,
        prumernyVykon: 0,
      };
    }
    
    const hodnoty = filtrovaneZaznamy.map(z => z.hodnota);
    const celkemHodnota = cviceni.typMereni === 'opakovani' 
      ? hodnoty.reduce((sum, h) => sum + h, 0)
      : hodnoty.reduce((sum, h) => sum + h, 0);
    
    const nejlepsiVykon = cviceni.smerovani === 'kratsi_lepsi'
      ? Math.min(...hodnoty)
      : Math.max(...hodnoty);
    
    const prumernyVykon = Math.round(celkemHodnota / hodnoty.length);
    
    return {
      pocetZaznamu: filtrovaneZaznamy.length,
      celkemHodnota,
      nejlepsiVykon,
      prumernyVykon,
    };
  }, [filtrovaneZaznamy, cviceni]);

  // Výpočet nových statistik pro aktuální období
  const vybranyDatum = new Date(); // Použijeme aktuální datum
  const aktivniDny = getPocetAktivnichDni(
    zaznamy.filter((z: ZaznamVykonu) => z.cviceniId === cviceni.id),
    vybranyDatum
  );
  const celkemDni = getPocetDniVMesici(vybranyDatum);
  const aktivniDnyText = `${aktivniDny}/${celkemDni}`;
  
  const plneniCilu = getPlneniCiluProcenta(
    zaznamy.filter((z: ZaznamVykonu) => z.cviceniId === cviceni.id),
    [cviceni], // Předáváme pouze aktuální cvičení
    vybranyDatum
  );

  const getZaznamyProDen = (den: Date) => {
    const zacatekDne = new Date(den);
    zacatekDne.setHours(0, 0, 0, 0);
    const konecDne = new Date(den);
    konecDne.setHours(23, 59, 59, 999);
    
    return zaznamy.filter(zaznam => {
      const datumZaznamu = new Date(zaznam.datumCas);
      return zaznam.cviceniId === cviceni.id && datumZaznamu >= zacatekDne && datumZaznamu <= konecDne;
    });
  };



  // Generování všech dní aktuálního měsíce
  const dnyMesice = React.useMemo(() => {
    const rok = vybranyDatum.getFullYear();
    const mesic = vybranyDatum.getMonth();
    
    // Počet dní v měsíci
    const pocetDni = getPocetDniVMesici(vybranyDatum);
    
    // Vytvoření pole všech dní měsíce (od 1. do posledního dne)
    return Array.from({ length: pocetDni }, (_, index) => {
      return new Date(rok, mesic, index + 1);
    });
  }, [vybranyDatum]);

  /** Formátování názvu dne a datumu */
  const getDenADatum = (den: Date) => {
    const dnyTydne = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
    const nazevDne = dnyTydne[den.getDay()];
    const datum = den.getDate();
    return { 
      cislo: `${datum}.`, // "1.", "2." atd.
      zkratka: nazevDne   // "Po", "Út" atd.
    };
  };

  /** Kontrola, zda je den dnes */
  const jeDnes = (den: Date): boolean => {
    const dnes = new Date();
    return den.toDateString() === dnes.toDateString();
  };

  /** Komponenta pro jeden řádek dne */
  const RadekDne = ({ den, index }: { den: Date; index: number }) => {
    const zaznamyDne = getZaznamyProDen(den);
    const maZaznamy = zaznamyDne.length > 0;
    
    // Výpočet celkové hodnoty pro třetí sloupec
    const celkovaHodnota = React.useMemo(() => {
      if (zaznamyDne.length === 0) return null;
      
      if (cviceni.typMereni === 'opakovani') {
        // Pro opakování: součet všech hodnot
        return zaznamyDne.reduce((suma, zaznam) => suma + zaznam.hodnota, 0);
      } else {
        // Pro časovky: nejlepší (nejkratší nebo nejdelší podle směrování)
        const hodnoty = zaznamyDne.map(z => z.hodnota);
        if (cviceni.smerovani === 'kratsi_lepsi') {
          return Math.min(...hodnoty); // Nejkratší čas
        } else {
          return Math.max(...hodnoty); // Nejdelší čas
        }
      }
    }, [zaznamyDne]);

    // Kontrola splnění denního cíle
    const jeSplnenyCil = React.useMemo(() => {
      if (!cviceni.denniCil || celkovaHodnota === null) return false;
      
      if (cviceni.typMereni === 'opakovani') {
        // Pro opakování: celková hodnota >= denní cíl
        return celkovaHodnota >= cviceni.denniCil;
      } else {
        // Pro časovky: závisí na směrování
        if (cviceni.smerovani === 'kratsi_lepsi') {
          // Kratší je lepší: nejlepší čas <= denní cíl
          return celkovaHodnota <= cviceni.denniCil;
        } else {
          // Delší je lepší: nejlepší čas >= denní cíl
          return celkovaHodnota >= cviceni.denniCil;
        }
      }
    }, [celkovaHodnota, cviceni.denniCil, cviceni.typMereni, cviceni.smerovani]);
    
    // Počet pozic závisí na typu cvičení
    const pocetPozic = cviceni.typMereni === 'cas' ? 5 : 10;
    
    // Pro časovky řadíme podle výkonu (nejlepší vlevo), pro opakování chronologicky
    const serazeneZaznamy = cviceni.typMereni === 'cas' 
      ? [...zaznamyDne].sort((a, b) => {
          // Řazení podle směrování cvičení
          if (cviceni.smerovani === 'kratsi_lepsi') {
            return a.hodnota - b.hodnota; // Nejkratší časy první (vzestupně)
          } else {
            return b.hodnota - a.hodnota; // Nejdelší časy první (sestupně)
          }
        })
      : zaznamyDne; // U opakování zachováváme původní pořadí
    
    const poziceZaznamu = Array.from({ length: pocetPozic }, (_, i) => {
      return serazeneZaznamy[i] || null;
    });
    
    // Kontrola, zda je více záznamů než pozic
    const maViceZaznamu = zaznamyDne.length > pocetPozic;

    const { cislo, zkratka } = getDenADatum(den);
    
    // Určení barvy podle typu dne
    const denVTydnu = den.getDay(); // 0 = Neděle, 6 = Sobota
    const jeVikend = denVTydnu === 0 || denVTydnu === 6; // So + Ne
    const jeToday = jeDnes(den);

    return (
      <View style={[styly.radekDne, index % 2 === 0 && styly.radekDneSudy]}>
        {/* Název dne a datum - 15% šířky */}
        <View style={[styly.nazevDneKontejner, { width: '15%' }]}>
          <Text style={[
            styly.cisloDne, 
            jeToday && styly.nazevDnesDnes, // Dnes - červeně
            !jeToday && jeVikend && styly.nazevDneVikend, // So + Ne - černě
            // Ostatní dny zůstávají šedé (základní nazevDne styl)
          ]}>
            {cislo}
          </Text>
          <Text style={[
            styly.zkratkaDne, 
            jeToday && styly.nazevDnesDnes, // Dnes - červeně
            !jeToday && jeVikend && styly.nazevDneVikend, // So + Ne - černě
            // Ostatní dny zůstávají šedé (základní nazevDne styl)
          ]}>
            {zkratka}
          </Text>
        </View>
        
        {/* Oddělovač */}
        <View style={styly.oddelovac} />
        
        {/* Záznamy - 65% šířky */}
        <View style={[styly.zaznamyKontejner, { width: '65%' }]}>
          {poziceZaznamu.map((zaznam, pozice) => {
            // Rovnoměrné šířky pro oba typy cvičení
            const sirkaPozice = cviceni.typMereni === 'cas' ? 32 : 18; // Časy zmenšeno na 32px pro lepší rozložení
            // Dynamické mezery pro rovnoměrné rozložení
            const mezeraPozice = cviceni.typMereni === 'cas' ? 1.2 : 1; // Časy 1.2px, opakování 1px
            
            return (
              <View 
                key={pozice} 
                style={[
                  styly.poziceZaznamu, 
                  { 
                    width: sirkaPozice,
                    marginHorizontal: mezeraPozice, // Dynamické mezery
                  },
                  zaznam && styly.poziceZaznamuAktivni
                ]}
              >
                {zaznam && (
                  <Text style={styly.hodnotaZaznamu}>
                    {formatovatHodnotu(zaznam.hodnota)},
                  </Text>
                )}
              </View>
            );
          })}
          
          {/* Tečky pokud je více záznamů */}
          {maViceZaznamu && (
            <View style={styly.teckyKontejner}>
              <Text style={styly.tecky}>...</Text>
            </View>
          )}
        </View>
        
        {/* Oddělovač před třetím sloupcem */}
        <View style={styly.oddelovac} />
        
        {/* Třetí sloupec - celková hodnota - 15% šířky */}
        <View style={[
          styly.tretiSloupec,
          { 
            width: '15%', // Pevná procentuální šířka
            justifyContent: cviceni.typMereni === 'opakovani' ? 'center' : 'flex-start' // Centrování pro opakování
          }
        ]}>
          {celkovaHodnota !== null && (
            <Text style={[
              styly.celkovaHodnota,
              jeSplnenyCil && styly.celkovaHodnotaSplnenyCil,
            ]}>
              {formatovatHodnotu(celkovaHodnota)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styly.tydenKontejner, 
      style,
      {
        borderWidth: 1.2,
        borderColor: cviceni.barva || '#e5e7eb',
      }
    ]}>
      {/* Barevná hlavička */}
      <View style={[styly.barevnyHeader, { backgroundColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.headerObsah}>
        <View style={styly.headerLeva}>
          <Ionicons 
            name="calendar" 
            size={20} 
            color="white" 
          />
        </View>
        <Text style={styly.headerText}>{t('exerciseDetail.statistics')}</Text>
        <View style={styly.headerPrava} />
      </View>
      </View>

      <View style={styly.obsah}>
        {/* Statistiky - přeneseno ze StatistikyKomponenta */}
        <View style={styly.statistikyObsah}>
          {/* První řádek statistik - Nejlepší a Cíle */}
          <View style={styly.statistikyRadek}>
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons name="flag" size={15.84} color="#f59e0b" />
                <Text style={styly.statistikaNazev}>{t('stats.best')}</Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{formatovatHodnotu(obdobiStatistiky.nejlepsiVykon)}</Text>
            </View>
            
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons name="trophy" size={15.84} color="#7c3aed" />
                <Text style={styly.statistikaNazev}>{t('overview.goalCompletion')}</Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{plneniCilu}%</Text>
            </View>
          </View>
          
          {/* Druhý řádek statistik - Průměr a Celkový čas */}
          <View style={styly.statistikyRadek}>
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons name="analytics" size={15.84} color="#8b5cf6" />
                <Text style={styly.statistikaNazev}>{t('stats.average')}</Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{formatovatHodnotu(obdobiStatistiky.prumernyVykon)}</Text>
            </View>
            
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons 
                  name={cviceni.typMereni === 'opakovani' ? 'calculator' : 'stopwatch'} 
                  size={15.84} 
                  color="#f97316" 
                />
                <Text style={styly.statistikaNazev}>
                  {cviceni.typMereni === 'opakovani' ? t('stats.total') : t('stats.totalTime')}
                </Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{formatovatHodnotu(obdobiStatistiky.celkemHodnota)}</Text>
            </View>
          </View>
          
          {/* Třetí řádek statistik - Aktivita a Záznamy */}
          <View style={styly.statistikyRadek}>
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons name="calendar" size={15.84} color="#dc2626" />
                <Text style={styly.statistikaNazev}>{t('overview.activeDays')}</Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{aktivniDnyText}</Text>
            </View>
            
            <View style={[styly.statistikaPolozka, { borderColor: cviceni.barva || '#e5e7eb' }]}>
              <View style={styly.statistikaHeader}>
                <Ionicons name="document-text" size={15.84} color="#3b82f6" />
                <Text style={styly.statistikaNazev}>{t('stats.records')}</Text>
              </View>
              <Text style={styly.statistikaHodnotaMensi}>{obdobiStatistiky.pocetZaznamu}</Text>
            </View>
          </View>
        </View>

        {/* Tabulka dnů bez scrollování */}
        <View style={styly.tabulka}>
          {dnyMesice.map((den: Date, index: number) => (
            <RadekDne 
              key={index} 
              den={den} 
              index={index}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styly = StyleSheet.create({
  tydenKontejner: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  barevnyHeader: {
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  headerObsah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerLeva: {
    width: 24,
    alignItems: 'flex-start',
  },
  headerPrava: {
    width: 24,
  },
  headerText: {
    fontSize: 16.3,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  obsah: {
    paddingVertical: 16,
    paddingHorizontal: 8,  // Zmenšeno z 16 na 8 pro širší tabulku
  },

  tabulka: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  radekDne: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24, // Pevná výška - původní menší velikost
    paddingVertical: 1, // Minimální padding
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  radekDneSudy: {
    backgroundColor: '#f8fafc',
  },
  nazevDneKontejner: {
    flexDirection: 'row', // Horizontální rozložení
    alignItems: 'baseline', // Zarovnání na baseline pro lepší vzhled
    justifyContent: 'flex-end', // Změněno na zarovnání doprava
    paddingRight: 4, // Změněno z paddingLeft na paddingRight
  },
  cisloDne: {
    fontSize: 9.35, // O 15% menší než zkratka (11 * 0.85)
    color: '#6b7280', // Tmavší šedá pro všední dny
    fontWeight: '600',
    textAlign: 'right',
    marginRight: 0, // Odstraněna mezera mezi číslem a zkratkou
    minWidth: 12, // Minimální šířka pro konzistentní zarovnání
  },
  zkratkaDne: {
    fontSize: 11.385, // Zmenšeno o 10% (12.65 * 0.9 = 11.385)
    color: '#6b7280', // Tmavší šedá pro všední dny
    fontWeight: '600',
    textAlign: 'left', // Zarovnání doleva
    minWidth: 16, // Minimální šířka pro konzistentní zarovnání zkratek
  },
  nazevDneVikend: {
    color: '#1f2937', // Černá pro sobotu a neděli
    fontWeight: '700',
  },
  nazevDnesDnes: {
    color: '#dc2626', // Červená pro dnes
    fontWeight: '800',
  },

  oddelovac: {
    width: 1,
    height: 16, // Zmenšeno pro kompaktnější rozložení
    backgroundColor: '#9ca3af', // Tmavší šedá pro lepší viditelnost
    marginLeft: 1, // Změněno z 5px na 1px pro jednotnost
    marginRight: 1, // Jednotný margin na obou stranách
  },
  zaznamyKontejner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0, // Žádný padding
    flexWrap: 'nowrap',
    height: 22, // Pevná výška
    overflow: 'hidden', // Zabraňuje přelévání obsahu
  },
  poziceZaznamu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20, // Kompaktní výška
    margin: 0, // Žádný margin
    padding: 0, // Žádný padding
  },
  poziceZaznamuAktivni: {
    // Žádné pozadí - pouze čísla
  },
  hodnotaZaznamu: {
    fontSize: 13.2, // Zvětšeno o 20% (11 * 1.2 = 13.2)
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    padding: 0, // Explicitně žádný padding
    margin: 0, // Explicitně žádný margin
    includeFontPadding: false, // Android - odstraní extra padding kolem textu
  },
  tretiSloupec: {
    alignItems: 'center', // Centrování obsahu horizontálně
    justifyContent: 'center', // Centrování obsahu vertikálně
    paddingLeft: 0, // Žádný padding
  },
  celkovaHodnota: {
    fontSize: 15.125, // Zvětšeno o 25% (12.1 * 1.25 = 15.125)
    fontWeight: '700', // Trochu tučnější pro zvýraznění
    color: '#1e3a8a', // Tmavší modrá - defaultní (nesplněný cíl)
    textAlign: 'center',
  },
  celkovaHodnotaSplnenyCil: {
    color: '#059669', // Zelená pro splněný denní cíl
    fontWeight: '700',
  },
  teckyKontejner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2, // Malá mezera od posledního záznamu
  },
  tecky: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af', // Světle šedá pro nenápadnost
    textAlign: 'center',
  },
  // Styly pro statistiky přenesené ze StatistikyKomponenta
  statistikyObsah: {
    paddingBottom: 4, // Mezera pod statistikami - kompenzace za marginBottom posledního řádku
  },
  statistikyRadek: {
    flexDirection: 'row',
    gap: responsiveSpacingValues.sm,
    marginBottom: responsiveSpacingValues.sm,
  },
  statistikaPolozka: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: responsiveSpacingValues.sm,
    padding: 7.2, // Zmenšeno o 10% (8 * 0.9 = 7.2)
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statistikaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacingValues.sm,
    gap: 5.94, // Zvětšeno o 10% z 5.4 na 5.94
  },
  statistikaNazev: {
    fontSize: (responsiveTypography.caption.fontSize - 1) * 1.1, // Zvětšeno o 10% (13px → 14.3px)
    color: '#6b7280',
    fontWeight: '500',
  },
  statistikaHodnotaMensi: {
    fontSize: responsiveTypography.body.fontSize * 1.1, // Zvětšeno o 10% (16px → 17.6px)
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },

}); 