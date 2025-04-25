import React, { useRef, useState, useEffect } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState(false);

  const onlineMotoboys = motoboys.filter((m) => m.status === 'online');

  useEffect(() => {
    const checkOverflow = () => {
      const el = scrollRef.current;
      if (el) {
        setShowNav(el.scrollWidth > el.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [onlineMotoboys]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.motoboyListContainer}>
      {showNav && <button className={styles.navButton} onClick={() => scroll('left')}>←</button>}

      <div className={styles.motoboyList} ref={scrollRef}>
        {onlineMotoboys.map((motoboy) => (
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

      {showNav && <button className={styles.navButton} onClick={() => scroll('right')}>→</button>}
    </div>
  );
};

export default MotoboyList;
