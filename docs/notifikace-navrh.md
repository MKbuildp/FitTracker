# Návrh implementace Push Notifikací pro Quotidis

## 1. Přehled

Implementace push notifikací pro fitness tracker Quotidis s cílem motivovat uživatele k pravidelnému cvičení a informovat o pokroku.

## 2. Typy notifikací

### 2.1 Připomenutí k cvičení
- **Kdy**: Nastavitelný denní čas (např. 8:00, 18:00)
- **Obsah**: "Nezapomeň na cvičení! Dnes máš ještě možnost splnit své cíle."
- **Frekvence**: Jednou denně (nebo vícekrát podle nastavení)
- **Podmínka**: Aktivní pouze pokud uživatel má alespoň jedno cvičení s denním cílem

### 2.2 Pokrok k cíli
- **Kdy**: Když uživatel dosáhne 50%, 75% nebo 90% denního cíle
- **Obsah**: "Skvělé! Už máš 75% z denního cíle pro [Název cvičení]."
- **Frekvence**: Max 3x denně (při prvním dosažení každého milníku)
- **Podmínka**: Pouze pro cvičení s nastaveným denním cílem

### 2.3 Splnění cíle
- **Kdy**: Když uživatel dosáhne 100% denního cíle
- **Obsah**: "🎉 Gratulujeme! Splnil/a jsi denní cíl pro [Název cvičení]!"
- **Frekvence**: Jednou denně pro každé cvičení
- **Podmínka**: Pouze pro cvičení s nastaveným denním cílem

### 2.4 Motivace při neaktivitě
- **Kdy**: Pokud uživatel nemá žádný záznam 2-3 dny po sobě
- **Obsah**: "Už to jsou 2 dny bez cvičení. Vrať se zpět do formy!"
- **Frekvence**: Jednou denně, pokud trvá neaktivita
- **Podmínka**: Kontrola historie záznamů

### 2.5 Celkový pokrok
- **Kdy**: Když uživatel dosáhne 50% nebo 100% globálního denního cíle (opakování/dokončená cvičení)
- **Obsah**: "Tvůj celkový pokrok: 50/100 opakování (50%)"
- **Frekvence**: Max 2x denně (50% a 100%)

## 3. Technická implementace

### 3.1 Závislosti
```json
{
  "expo-notifications": "~0.28.0"
}
```

### 3.2 Struktura souborů
```
context/
  NotificationContext.tsx       # Kontext pro správu notifikací
utils/
  notifikace/
    index.ts                    # Hlavní API pro notifikace
    scheduler.ts                # Plánování notifikací
    helpers.ts                  # Pomocné funkce
    types.ts                    # Typy pro notifikace
screens/
  Nastaveni/
    NotifikaceScreen.tsx        # Obrazovka nastavení notifikací
    components/
      NotifikaceNastaveni.tsx   # Komponenta s přepínači
hooks/
  useNotifications.ts           # Hook pro použití notifikací
```

### 3.3 Ukládání nastavení
- AsyncStorage klíč: `nastaveni_notifikaci`
- Struktura:
```typescript
interface NastaveniNotifikaci {
  povolene: boolean;
  casPripominky: string[];      // ["08:00", "18:00"]
  pokrokKcili: boolean;          // Notifikace o pokroku
  splneniCile: boolean;          // Notifikace o splnění
  motivaceNeaktivita: boolean;   // Motivace při neaktivitě
  celkovyPokrok: boolean;        // Celkový pokrok
}
```

### 3.4 Logika plánování

#### 3.4.1 Připomenutí k cvičení
- Naplánovat při startu aplikace nebo změně nastavení
- Použít `expo-notifications` scheduleNotificationAsync
- Opakovat denně v nastaveném čase

#### 3.4.2 Pokrok k cíli
- Kontrolovat při přidání nového záznamu
- Vypočítat aktuální pokrok
- Pokud dosáhl nového milníku (50%, 75%, 90%), odeslat notifikaci
- Uložit již odeslané milníky pro daný den (aby se neopakovaly)

#### 3.4.3 Splnění cíle
- Kontrolovat při přidání nového záznamu
- Pokud dosáhl 100% a ještě dnes neodeslal notifikaci, odeslat

#### 3.4.4 Motivace při neaktivitě
- Kontrolovat při startu aplikace
- Pokud poslední záznam je starší než X dní, odeslat notifikaci
- Uložit poslední odeslaný datum (aby se neopakovala denně)

#### 3.4.5 Celkový pokrok
- Kontrolovat při přidání nového záznamu
- Vypočítat celkový pokrok (opakování + dokončená cvičení)
- Porovnat s globálními cíli
- Odeslat při dosažení milníku

## 4. Integrace do aplikace

### 4.1 App.tsx
- Přidat `NotificationProvider` do provider tree
- Požádat o oprávnění při startu
- Registrovat notification handlers

### 4.2 CviceniContext
- Při přidání záznamu volat kontrolu notifikací
- Při změně denního cíle aktualizovat plánované notifikace

### 4.3 Nastavení
- Přidat obrazovku nastavení notifikací do navigace
- Možnost zapnout/vypnout jednotlivé typy
- Nastavení času připomínek

## 5. Lokalizace

Přidat překlady do `translations/cs.ts` a `translations/en.ts`:
- `notifications.title`: "Notifikace"
- `notifications.enabled`: "Povolit notifikace"
- `notifications.reminder`: "Připomenutí k cvičení"
- `notifications.reminderTime`: "Čas připomínky"
- `notifications.progress`: "Pokrok k cíli"
- `notifications.goalAchieved`: "Splnění cíle"
- `notifications.motivation`: "Motivace při neaktivitě"
- `notifications.overallProgress`: "Celkový pokrok"
- A další...

## 6. Oprávnění

- Android: Automaticky řešeno Expo
- iOS: Požádat o oprávnění při prvním spuštění
- Zobrazit dialog s vysvětlením, proč jsou notifikace užitečné

## 7. Testování

- Testovat každý typ notifikace zvlášť
- Testovat kombinace různých typů
- Testovat edge cases (žádná cvičení, žádné cíle, atd.)
- Testovat na Android a iOS

## 8. Fáze implementace

1. **Fáze 1**: Základní setup (závislosti, kontext, oprávnění)
2. **Fáze 2**: Připomenutí k cvičení (nejjednodušší)
3. **Fáze 3**: Pokrok k cíli a splnění cíle
4. **Fáze 4**: Motivace při neaktivitě a celkový pokrok
5. **Fáze 5**: UI pro nastavení
6. **Fáze 6**: Testování a finální úpravy

## 9. Alternativní přístupy

### Možnost A: Jednotlivá cvičení
- Notifikace pro každé cvičení zvlášť
- Uživatel si může vybrat, pro která cvičení chce notifikace
- Složitější UI, ale větší kontrola

### Možnost B: Globální notifikace
- Jedna sada notifikací pro celou aplikaci
- Jednodušší implementace a UI
- Méně granularity

**Doporučení**: Začít s **Možností B** (globální), později rozšířit na **Možnost A** pokud bude potřeba.


