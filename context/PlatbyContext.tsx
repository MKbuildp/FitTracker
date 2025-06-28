import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

/**
 * @description Typy pro položky a stav platebního kontextu.
 */
interface PlatbyContextState {
    jePremium: boolean;
    produkty: InAppPurchases.IAPItem[];
    nacitaSe: boolean;
    inicializovano: boolean;
    koupitPremium: () => Promise<void>;
    obnovitNakupy: () => Promise<void>;
}

const PlatbyContext = createContext<PlatbyContextState | undefined>(undefined);

// ID produktu, které musíte vytvořit v Google Play Console
const SKU_PREMIUM = Platform.OS === 'android' ? 'premium_unlock' : 'premium_unlock_ios';

/**
 * @description Poskytovatel (Provider) pro správu stavu plateb a nákupů v aplikaci.
 */
export const PlatbyProvider = ({ children }: { children: ReactNode }) => {
    const [jePremium, setJePremium] = useState(false);
    const [produkty, setProdukty] = useState<InAppPurchases.IAPItem[]>([]);
    const [nacitaSe, setNacitaSe] = useState(false);
    const [inicializovano, setInicializovano] = useState(false);

    useEffect(() => {
        const inicializovatPlatby = async () => {
            setNacitaSe(true);
            try {
                await InAppPurchases.connectAsync();
                await nacistProdukty();
                await obnovitNakupy();
            } catch (e) {
                console.error("Chyba při inicializaci plateb:", e);
            } finally {
                setNacitaSe(false);
                setInicializovano(true);
            }
        };

        inicializovatPlatby();

        return () => {
            InAppPurchases.disconnectAsync();
        };
    }, []);

    useEffect(() => {
        const purchaseUpdateSubscription = InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                for (const nakup of results) {
                    if (!nakup.acknowledged) {
                        if (nakup.purchaseState === InAppPurchases.PurchaseState.PURCHASED) {
                            console.log(`Úspěšně zakoupen produkt: ${nakup.productId}`);
                            if (nakup.productId === SKU_PREMIUM) {
                                setJePremium(true);
                            }
                            // Potvrzení nákupu, aby Google věděl, že jsme produkt doručili
                            await InAppPurchases.finishTransactionAsync(nakup, true);
                        }
                    }
                }
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                console.log('Uživatel zrušil nákup.');
            } else {
                console.warn(`Něco se pokazilo s nákupem. Kód chyby: ${errorCode}`);
            }
        });

        return () => {
            purchaseUpdateSubscription.remove();
        };
    }, []);

    const nacistProdukty = async () => {
        try {
            const { responseCode, results } = await InAppPurchases.getProductsAsync([SKU_PREMIUM]);
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                setProdukty(results);
                console.log("Dostupné produkty:", results);
            }
        } catch (e) {
            console.error("Chyba při načítání produktů:", e);
        }
    };

    const koupitPremium = async () => {
        if (produkty.length === 0) {
            console.warn("Žádné produkty k nákupu.");
            return;
        }
        try {
            await InAppPurchases.purchaseItemAsync(SKU_PREMIUM);
        } catch (e) {
            console.error("Chyba při pokusu o nákup:", e);
        }
    };

    const obnovitNakupy = async () => {
        try {
            const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                for (const nakup of results) {
                    if (nakup.productId === SKU_PREMIUM && nakup.purchaseState === InAppPurchases.PurchaseState.PURCHASED) {
                        setJePremium(true);
                        console.log("Nákup premium byl obnoven.");
                        break;
                    }
                }
            }
        } catch (e) {
            console.error("Chyba při obnovování nákupů:", e);
        }
    };

    const value = {
        jePremium,
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