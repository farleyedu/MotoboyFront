import React from 'react';
import { Motoboy, Delivery } from './types';
import MotoboyCard from './motoboyCard';
import styles from '../../style/MotoboyList.module.css';

interface MotoboyListProps {
  motoboys: Motoboy[];
  activeMotoboy: number | null;
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (id: number) => void;
  onHoverPedido: (pedido: Delivery, index: number, all: Delivery[]) => void;
}

const MotoboyList: React.FC<MotoboyListProps> = ({
  motoboys,
  activeMotoboy,
  onLocateMotoboy,
  onShowDetails,
  onHoverPedido,
}) => {
  return (
    <div className={styles.motoboyListContainer}>
      <div className={styles.motoboyList}>
        {motoboys.map((motoboy) => (
          <MotoboyCard
            key={motoboy.id}
            motoboy={motoboy}
            isActive={activeMotoboy === motoboy.id}
            onLocateMotoboy={onLocateMotoboy}
            onShowDetails={onShowDetails}
            onHoverPedido={onHoverPedido}
          />
        ))}
      </div>
    </div>
  );
};

export default MotoboyList;
