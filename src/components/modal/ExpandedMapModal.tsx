import React, { RefObject } from 'react';
import styles from '../../style/ExpandedMapModal.module.css'; // ou o caminho correto do seu CSS
import { Motoboy } from '../ui/types';

interface ExpandedMapModalProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  motoboys: Motoboy[];
  onClose: () => void;
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (motoboyId: number) => void;
}

const ExpandedMapModal: React.FC<ExpandedMapModalProps> = ({
  mapContainerRef,
  motoboys,
  onClose,
  onLocateMotoboy,
  onShowDetails,
}) => {
  return (
    <div className={styles.expandedMapModal}>
      <div className={styles.mapHeader}>
        <h2>Mapa Expandido</h2>
        <button onClick={onClose}>Fechar</button>
      </div>
      <div ref={mapContainerRef} className={styles.mapContainer} />
      {/* Você pode incluir uma lista de motoboys aqui se quiser também */}
    </div>
  );
};

export default ExpandedMapModal;
