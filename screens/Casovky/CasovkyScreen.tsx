import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCviceni } from '../../context/CviceniContext';
import { CasovkyNavigationProp } from './types/types';
import { filtrovatCasovky, jeNacitaSeData, jeSeznamPrazdny } from './utils/helpers';
import { NacitaniStav, PrazdnyStav, SeznamCasovek } from './components';

/**
 * Shell komponenta pro obrazovku Časovky.
 */
const CasovkyScreen: React.FC = () => {
  const { stav } = useCviceni();
  const navigation = useNavigation<CasovkyNavigationProp>();



  const casovky = useMemo(() => 
    filtrovatCasovky(stav.cviceni), 
    [stav.cviceni]
  );

  if (jeNacitaSeData(stav.nacitaSeData)) {
    return <NacitaniStav />;
  }

  if (jeSeznamPrazdny(casovky)) {
    return <PrazdnyStav />;
  }

  return (
    <SeznamCasovek 
      casovky={casovky}
      zaznamy={stav.zaznamy}
      navigation={navigation}
    />
  );
};

export default CasovkyScreen; 