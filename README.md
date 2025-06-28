# 🏋️ FitTracker

Moderní React Native aplikace pro sledování cvičení a pokroku s podporou opakování i času.

## ✨ Funkce

### 🎯 Hlavní funkce
- **Správa cvičení** - Přidávání, editace a mazání cvičení
- **Dva typy měření** - Opakování nebo čas
- **Inteligentní směrování** - Pro čas: kratší/lepší vs delší/lepší
- **Sledování pokroku** - História výkonů a statistiky
- **Moderní UI** - Čisté a intuitivní rozhraní

### 📊 Typy cvičení
- **Opakování**: Kliky, dřepy, shyby (počet opakování)
- **Čas - kratší lepší**: Běh, sprint (lepší = kratší čas)
- **Čas - delší lepší**: Plank, výdrž (lepší = delší čas)

### 📱 Obrazovky
- **Seznam cvičení** - Přehled všech cvičení s rychlými akcemi
- **Pokrok** - Statistiky a přehled dnešní aktivity
- **Profil** - Osobní statistiky a nastavení
- **Přidat cvičení** - Formulář pro nové cvičení
- **Přidat záznam** - Rychlé zaznamenání výkonu

## 🛠️ Technologie

- **React Native** 0.79.3
- **Expo SDK** 53.0.10  
- **TypeScript** ~5.8.3
- **React Navigation** - Tab + Stack navigace
- **AsyncStorage** - Lokální ukládání dat
- **Ionicons** - Ikony

## 🚀 Spuštění

### Požadavky
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go aplikace na telefonu

### Instalace
```bash
# Klonování projektu
git clone <repo-url>
cd FitTracker

# Instalace závislostí
npm install

# Spuštění
npm start
```

### Testování
1. Spusťte `npm start`
2. Naskenujte QR kód aplikací Expo Go
3. Aplikace se spustí na vašem telefonu

## 📁 Struktura projektu

```
FitTracker/
├── screens/           # Obrazovky aplikace
│   ├── SeznamCviceni/ # Seznam cvičení
│   ├── Pokrok/        # Statistiky pokroku
│   ├── Profil/        # Uživatelský profil
│   └── PridatCviceni/ # Přidání cvičení
├── context/           # React Context
├── types/             # TypeScript typy
├── utils/             # Pomocné funkce
└── docs/              # Dokumentace
```

## 🎨 UI/UX Design

### Barevná paleta
- **Primární**: `#2563eb` (modrá)
- **Úspěch**: `#059669` (zelená)  
- **Pozor**: `#dc2626` (červená)
- **Pozadí**: `#f8fafc` (světle šedá)

### Komponenty
- **Karty** - Zaoblené rohy, stíny
- **Tlačítka** - Velká, přístupná
- **Formuláře** - Jasné labely, validace
- **Navigace** - Bottom tabs s ikonami

## 📝 Použití

### Přidání cvičení
1. Klikněte na tlačítko "+" na hlavní obrazovce
2. Zadejte název a popis cvičení
3. Vyberte typ měření (opakování/čas)
4. Pro čas vyberte směrování (kratší/delší lepší)
5. Volitelně přidejte jednotku

### Zaznamenání výkonu
1. U cvičení klikněte na ikonu "+"
2. Zadejte hodnotu (počet nebo čas)
3. Volitelně přidejte poznámku
4. Uložte záznam

### Sledování pokroku
- **Pokrok** tab - celkové statistiky
- **Profil** tab - osobní přehled
- Historie záznamů u každého cvičení

## 🔄 Budoucí rozšíření

### V příští verzi
- [ ] Grafy pokroku
- [ ] Export/import dat
- [ ] Notifikace
- [ ] Témata aplikace
- [ ] Detailní statistiky

### Možná rozšíření
- [ ] Sociální sdílení
- [ ] Workout plány
- [ ] Osobní trenér
- [ ] Apple Health integrace

## 📊 Architektura

### Context Pattern
- Centralizovaná správa stavu
- React hooks pro snadné použití
- AsyncStorage pro perzistenci

### TypeScript
- Kompletní type safety
- Jasné interface definice
- IntelliSense podpora

### Modularita
- Každá obrazovka má vlastní složku
- Znovupoužitelné komponenty
- Separace logiky od UI

## 🤝 Příspěvky

Aplikace je navržena podle moderních React Native standardů:
- Funkcionální komponenty + Hooks
- TypeScript pro type safety
- Expo Managed Workflow
- Optimalizace výkonu (React.memo)

## 📱 Kompatibilita

- **Expo Go**: Plně kompatibilní ✅
- **iOS**: Testováno ✅
- **Android**: Testováno ✅
- **Web**: Expo web podpora ✅

## 📄 Licence

MIT License - viz LICENSE soubor

---

**FitTracker** - Váš spolehlivý partner pro sledování fitness pokroku! 💪 