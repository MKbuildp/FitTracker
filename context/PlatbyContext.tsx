import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const PlatbyContext = createContext<PlatbyContextState | undefined>(undefined);

/**
 * @description Dočasný poskytovatel (Provider) pro správu stavu plateb - bez skutečných plateb.
 * Tato verze je určena pro build bez platebních funkcí a automaticky aktivuje Premium funkce.
 */
export const PlatbyProvider = ({ children }: { children: ReactNode }) => {
    // Nastavíme jePremium na false, aby se zobrazovala platební brána
    const [jePremium, setJePremium] = useState(false);
    const [produkty] = useState<MockIAPItem[]>([
        {
            productId: 'premium_unlock',
            price: '99 Kč',
            title: 'Premium Unlock',
            description: 'Odemkne všechny premium funkce'
        }
    ]);
    const [nacitaSe] = useState(false);
    const [inicializovano] = useState(true);

    const koupitPremium = async () => {
        // V reálné aplikaci by zde byla logika pro platbu
        // Prozatím můžeme simulovat úspěch, ale ne automaticky
    };

    const obnovitNakupy = async () => {
        // V reálné aplikaci by zde byla logika pro obnovení nákupů
        // Prozatím můžeme simulovat úspěch, ale ne automaticky
    };

    const value = {
        jePremium,
        setJePremium,
        produkty,
        nacitaSe,
        inicializovano,
        koupitPremium,
        obnovitNakupy,
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