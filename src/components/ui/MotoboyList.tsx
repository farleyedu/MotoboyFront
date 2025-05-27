import React, { useRef, useState, useEffect } from 'react';
import {Delivery, MotoboyComPedidosDTO } from './types';
import MotoboyCard from './motoboyCard';
import styles from '../../style/MotoboyList.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MotoboyListProps {
  motoboys: MotoboyComPedidosDTO[];
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
  const [showNav, setShowNav] = useState(true);

  const onlineMotoboys = motoboys.filter((m) => m.status === 'online');

  useEffect(() => {
    const checkOverflow = () => {
      const el = scrollRef.current;
      if (el) {
        setShowNav(el.scrollWidth > el.clientWidth);
      }
    };

    const timeout = setTimeout(checkOverflow, 0);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkOverflow);
    }
    return () => {
      clearTimeout(timeout);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkOverflow);
      }
    };
  }, [onlineMotoboys.length]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.motoboyListWrapper}>
      {showNav && (
        <button
          className={`${styles.navButton} ${styles.navButtonLeft}`}
          style={{ left: '-10px', top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <div className={styles.motoboyList} ref={scrollRef}>
        {onlineMotoboys.map((motoboy) => (
          <MotoboyCard
            key={motoboy.id}
            motoboy={motoboy}
            onLocateMotoboy={onLocateMotoboy}
            onShowDetails={onShowDetails}
            onHoverPedido={onHoverPedido}
            isActive={motoboy.id === activeMotoboy}
          />
        ))}
      </div>

      {showNav && (
        <button
          className={`${styles.navButton} ${styles.navButtonRight}`}
          style={{ right: '-10px', top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => scroll('right')}
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
};

export default MotoboyList;
