/**
 * Utilities pro Android Health Connect API
 * 
 * Health Connect je moderní platforma pro zdravotní a fitness data na Androidu.
 * Nahrazuje Google Fit API (které končí 30.6.2025).
 */

import { Platform, NativeModules } from 'react-native';

const { HealthConnectModule } = NativeModules;

export interface HealthConnectSteps {
  steps: number;
  date: Date;
  startTime: Date;
  endTime: Date;
}

export interface HealthConnectPermissionResult {
  granted: boolean;
  deniedPermissions?: string[];
}

/**
 * Typy oprávnění pro Health Connect
 */
export enum HealthConnectPermission {
  READ_STEPS = 'android.permission.health.READ_STEPS',
  WRITE_STEPS = 'android.permission.health.WRITE_STEPS',
}

/**
 * Kontrola, zda je Health Connect dostupný na zařízení
 * 
 * Health Connect je dostupný:
 * - Android 14+: integrováno v systému
 * - Android 9-13: musí být nainstalováno z Play Store
 */
export const isHealthConnectAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !HealthConnectModule) {
    return false;
  }
  
  try {
    return await HealthConnectModule.isAvailable();
  } catch (error) {
    console.error('Health Connect check error:', error);
    return false;
  }
};

/**
 * Požádání o oprávnění pro čtení kroků
 * 
 * Health Connect používá granularní oprávnění na úrovni datových typů.
 * Uživatel může povolit/zakázat každý typ dat zvlášť.
 */
export const requestHealthConnectPermissions = async (
  permissions: HealthConnectPermission[]
): Promise<HealthConnectPermissionResult> => {
  if (!HealthConnectModule) {
    return {
      granted: false,
      deniedPermissions: permissions,
    };
  }
  
  try {
    const granted = await HealthConnectModule.requestPermissions();
    return {
      granted,
      deniedPermissions: granted ? undefined : permissions,
    };
  } catch (error) {
    console.error('Health Connect permission error:', error);
    return {
      granted: false,
      deniedPermissions: permissions,
    };
  }
};

/**
 * Získání denních kroků z Health Connect
 * 
 * @param date Datum, pro které chceme získat kroky
 * @returns Počet kroků za daný den nebo null pokud není dostupné
 */
export const getHealthConnectSteps = async (date: Date): Promise<HealthConnectSteps | null> => {
  if (!HealthConnectModule) {
    return null;
  }
  
  try {
    const dateMillis = date.getTime();
    const steps = await HealthConnectModule.getDailySteps(dateMillis);
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      steps: Math.round(steps),
      date,
      startTime: startOfDay,
      endTime: endOfDay,
    };
  } catch (error) {
    console.error('Health Connect get steps error:', error);
    return null;
  }
};

/**
 * Získání kroků pro časový rozsah
 */
export const getHealthConnectStepsRange = async (
  startDate: Date,
  endDate: Date
): Promise<HealthConnectSteps[]> => {
  // TODO: Implementovat přes nativní modul
  return [];
};

/**
 * Zápis kroků do Health Connect
 * 
 * Poznámka: Obvykle se kroky zapisují automaticky systémem nebo jinými aplikacemi.
 * Tato funkce může být užitečná pro korekce nebo manuální záznamy.
 */
export const writeHealthConnectSteps = async (
  steps: number,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  // TODO: Implementovat přes nativní modul
  // Health Connect SDK: StepsRecord.insertRecords()
  return false;
};







