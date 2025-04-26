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
  const [showNav, setShowNav] = useState(true);

  const onlineMotoboys = motoboys.filter((m) => m.status === 'online');

  useEffect(() => {
    const checkOverflow = () => {
      const el = scrollRef.current;
      if (el) {
        console.log("clientWidth:", el.clientWidth, "scrollWidth:", el.scrollWidth);
        setShowNav(el.scrollWidth > el.clientWidth);
      }
    };

    const timeout = setTimeout(checkOverflow, 0); // garante que o DOM já esteja pronto

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
      <button className={styles.navButton} onClick={() => scroll('left')}>←</button>

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

      <button className={styles.navButton} onClick={() => scroll('right')}>→</button>
    </div>

  );

};

export default MotoboyList;
