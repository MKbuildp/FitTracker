import React from 'react';
import { CviceniKarta } from '../../../components/CviceniKarta';
import { CasovkaPolozkaProps } from '../types/types';

/** Komponenta pro zobrazení jedné časovky v seznamu */
export const CasovkaPolozka: React.FC<CasovkaPolozkaProps> = React.memo(({ 
  cviceni, 
  zaznamy, 
  navigation 
}) => {
  return (
    <CviceniKarta 
      cviceni={cviceni} 
      zaznamy={zaznamy}
      navigation={navigation}
    />
  );
}); 