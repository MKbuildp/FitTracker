import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { 
  isHealthConnectAvailable, 
  getHealthConnectSteps,
  requestHealthConnectPermissions,
  HealthConnectPermission
} from '../utils/healthConnect';

interface UseStepsResult {
  steps: number | null;
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pro čtení kroků z telefonu
 * 
 * iOS: Používá expo-sensors Pedometer API
 * Android: Zkouší Health Connect (pokud je dostupné), jinak expo-sensors Pedometer
 */
export const useSteps = (): UseStepsResult => {
  const [steps, setSteps] = useState<number | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout | null = null;

    const aktualizovatKroky = async () => {
      try {
        // Android: Zkusit Health Connect
        if (Platform.OS === 'android') {
          const healthConnectAvailable = await isHealthConnectAvailable();
          
          if (healthConnectAvailable) {
            // Použít Health Connect
            try {
              // Požádat o oprávnění, pokud ještě nejsou udělena
              const permissionResult = await requestHealthConnectPermissions([
                HealthConnectPermission.READ_STEPS
              ]);
              
              if (!permissionResult.granted) {
                if (!isMounted) return;
                setIsAvailable(false);
                setIsLoading(false);
                setError('Oprávnění pro čtení kroků nebylo uděleno.');
                return;
              }

              // Získat denní kroky
              const dnes = new Date();
              const healthConnectData = await getHealthConnectSteps(dnes);
              
              if (!isMounted) return;

              if (healthConnectData) {
                setSteps(healthConnectData.steps);
                setIsAvailable(true);
                setError(null);
                setIsLoading(false);
                return;
              }
            } catch (healthConnectError) {
              console.warn('Health Connect chyba:', healthConnectError);
              // Fallback na Pedometer
            }
          }
        }

        // iOS nebo fallback na Androidu: Použít expo-sensors Pedometer
        const available = await Pedometer.isAvailableAsync();
        
        if (!isMounted) return;

        setIsAvailable(available);

        if (!available) {
          setIsLoading(false);
          setError('Pedometer není dostupný na tomto zařízení.');
          return;
        }

        // Získání počátku dne (půlnoc)
        const dnes = new Date();
        dnes.setHours(0, 0, 0, 0);
        const ted = new Date();

        // Získání aktuálních kroků od půlnoci
        // Poznámka: getStepCountAsync funguje pouze na iOS, na Androidu vrátí chybu
        try {
          const stepCount = await Pedometer.getStepCountAsync(dnes, ted);
          
          if (!isMounted) return;

          if (stepCount && stepCount.steps !== null && stepCount.steps !== undefined) {
            setSteps(stepCount.steps);
            setError(null);
          } else {
            setSteps(0);
          }
        } catch (getStepError) {
          // Na Androidu getStepCountAsync nefunguje
          if (!isMounted) return;
          console.warn('getStepCountAsync není podporováno na této platformě:', getStepError);
          setIsAvailable(false);
          setError('Denní kroky nejsou podporovány na této platformě.');
        }
        
        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Chyba při čtení kroků:', err);
        setError('Nepodařilo se načíst kroky.');
        setIsLoading(false);
      }
    };

    // První načtení
    aktualizovatKroky();

    // Aktualizace kroků každou minutu
    interval = setInterval(() => {
      if (isAvailable && !isLoading) {
        aktualizovatKroky();
      }
    }, 60000); // Každou minutu

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return { steps, isAvailable, isLoading, error };
};

