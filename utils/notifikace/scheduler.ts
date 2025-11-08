import * as Notifications from 'expo-notifications';
import { NastaveniNotifikaci } from './types';

/** Nastavení chování notifikací */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Zruší všechny naplánované připomínky
 */
export async function zrusitVsechnyPripominky(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Texty notifikací podle jazyka */
const textyNotifikaci = {
  cs: {
    title: 'Připomenutí k cvičení',
    body: 'Nezapomeň na cvičení! Dnes máš ještě možnost splnit své cíle.',
  },
  en: {
    title: 'Exercise Reminder',
    body: "Don't forget to exercise! You still have a chance to reach your goals today.",
  },
};

/**
 * Naplánuje připomínky podle nastavení
 */
export async function naplanovatPripominky(
  nastaveni: NastaveniNotifikaci,
  currentLanguage: 'cs' | 'en'
): Promise<void> {
  // Nejdřív zrušíme všechny existující notifikace
  await zrusitVsechnyPripominky();

  // Pokud jsou notifikace vypnuté, skončíme
  if (!nastaveni.povolene || nastaveni.casPripominky.length === 0) {
    return;
  }

  const text = textyNotifikaci[currentLanguage];

  // Naplánujeme každou připomínku
  for (const cas of nastaveni.casPripominky) {
    const [hodiny, minuty] = cas.split(':').map(Number);

    if (isNaN(hodiny) || isNaN(minuty) || hodiny < 0 || hodiny > 23 || minuty < 0 || minuty > 59) {
      console.warn(`Neplatný čas připomínky: ${cas}`);
      continue;
    }

    // Vypočítáme datum pro první notifikaci
    const ted = new Date();
    const dnesniCas = new Date();
    dnesniCas.setHours(hodiny, minuty, 0, 0);

    let prvniNotifikace: Date;

    if (dnesniCas > ted) {
      // Čas je dnes v budoucnosti - naplánujeme na dnes
      prvniNotifikace = dnesniCas;
    } else {
      // Čas už dnes prošel - naplánujeme na zítřek
      prvniNotifikace = new Date(dnesniCas);
      prvniNotifikace.setDate(prvniNotifikace.getDate() + 1);
    }

    // Použijeme DateTriggerInput s opakováním - spolehlivější v production buildu
    const trigger: Notifications.DateTriggerInput = {
      date: prvniNotifikace,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: text.title,
        body: text.body,
        sound: true,
      },
      trigger,
    });
  }
}

/**
 * Zkontroluje a požádá o oprávnění k notifikacím
 */
export async function ziskatOpravneni(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

