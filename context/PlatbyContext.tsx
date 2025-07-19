import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Klíče pro AsyncStorage
const PREMIUM_STATUS_KEY = 'premium_status';
const PREMIUM_ACTIVATED_BY_KEY = 'premium_activated_by';
const PROMO_CODE_KEY = 'promo_code_used';

/**
 * @description Typy pro položky a stav platebního kontextu (dočasná verze bez plateb).
 */
interface MockIAPItem {
    productId: string;
    price: string;
    title: string;
    description: string;
}

interface PlatbyContextState {
    jePremium: boolean;
    setJePremium: React.Dispatch<React.SetStateAction<boolean>>;
    produkty: MockIAPItem[];
    nacitaSe: boolean;
    inicializovano: boolean;
    koupitPremium: () => Promise<void>;
    obnovitNakupy: () => Promise<void>;
    aktivovatPremiumPromoKodem: (promoKod: string) => Promise<boolean>;
}

const PlatbyContext = createContext<PlatbyContextState | undefined>(undefined);

/**
 * @description Funkce pro ukládání Premium stavu do AsyncStorage
 */
const ulozitPremiumStav = async (jePremium: boolean, aktivovanoPres?: string, promoKod?: string) => {
    try {
        await AsyncStorage.setItem(PREMIUM_STATUS_KEY, jePremium.toString());
        if (aktivovanoPres) {
            await AsyncStorage.setItem(PREMIUM_ACTIVATED_BY_KEY, aktivovanoPres);
        }
        if (promoKod) {
            await AsyncStorage.setItem(PROMO_CODE_KEY, promoKod);
        }
    } catch (error) {
        console.error('Chyba při ukládání Premium stavu:', error);
    }
};

/**
 * @description Funkce pro načtení Premium stavu z AsyncStorage
 */
const nacistPremiumStav = async (): Promise<boolean> => {
    try {
        const premiumStatus = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
        return premiumStatus === 'true';
    } catch (error) {
        console.error('Chyba při načítání Premium stavu:', error);
        return false;
    }
};

/**
 * @description Dočasný poskytovatel (Provider) pro správu stavu plateb - s ukládáním do AsyncStorage.
 * Tato verze ukládá Premium stav lokálně a načítá ho při startu aplikace.
 */
export const PlatbyProvider = ({ children }: { children: ReactNode }) => {
    const [jePremium, setJePremium] = useState(false);
    const [nacitaSe, setNacitaSe] = useState(true);
    const [inicializovano, setInicializovano] = useState(false);
    const [produkty] = useState<MockIAPItem[]>([
        {
            productId: 'premium_unlock',
            price: '99 Kč',
            title: 'Premium Unlock',
            description: 'Odemkne všechny premium funkce'
        }
    ]);

    // Načtení Premium stavu při startu aplikace
    useEffect(() => {
        inicializovatPremiumStav();
    }, []);

    const inicializovatPremiumStav = async () => {
        try {
            setNacitaSe(true);
            const premiumStav = await nacistPremiumStav();
            setJePremium(premiumStav);
        } catch (error) {
            console.error('Chyba při inicializaci Premium stavu:', error);
        } finally {
            setNacitaSe(false);
            setInicializovano(true);
        }
    };

    const koupitPremium = async () => {
        // V reálné aplikaci by zde byla logika pro platbu
        // Po úspěšné platbě:
        setJePremium(true);
        await ulozitPremiumStav(true, 'purchase');
    };

    const obnovitNakupy = async () => {
        // V reálné aplikaci by zde byla logika pro obnovení nákupů
        // Po úspěšném obnovení:
        const premiumStav = await nacistPremiumStav();
        setJePremium(premiumStav);
    };

    const aktivovatPremiumPromoKodem = async (promoKod: string): Promise<boolean> => {
        // Kontrola platného promo kódu
        if (promoKod.toUpperCase() === 'GOOGLEPLAYREVIEW') {
            setJePremium(true);
            await ulozitPremiumStav(true, 'promo_code', promoKod.toUpperCase());
            return true;
        }
        return false;
    };

    const value = {
        jePremium,
        setJePremium,
        produkty,
        nacitaSe,
        inicializovano,
        koupitPremium,
        obnovitNakupy,
        aktivovatPremiumPromoKodem,
    };

    return (
        <PlatbyContext.Provider value={value}>
            {children}
        </PlatbyContext.Provider>
    );
};

/**
 * @description Hook pro snadné použití platebního kontextu v komponentách.
 */
export const usePlatby = () => {
    const context = useContext(PlatbyContext);
    if (context === undefined) {
        throw new Error('usePlatby musí být použit uvnitř PlatbyProvider');
    }
    return context;
}; 