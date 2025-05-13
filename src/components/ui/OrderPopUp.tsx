// components/ui/OrderPopup.tsx

import React, { useRef, useEffect } from 'react';
import styles from '../../style/OrderPopup.module.css';
import { Order } from './types';

interface OrderPopupProps {
  order: Order;
  onClose: () => void;
}

const OrderPopup: React.FC<OrderPopupProps> = ({ order, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const itemsArray = Array.isArray(order.items) ? order.items : [order.items];

  return (
    <div ref={popupRef} className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.header}>Pedido #{order.id}</div>
      <div className={styles.address}>📍 {order.address ?? 'Endereço não informado'}</div>

      {/* Itens */}
      <ul className={styles.itemsList}>

        <div className={styles.sectionTitle}>Itens</div>
        {itemsArray.map((item, index) => (
          <li key={index} className={styles.item}>- {item} <span className={styles.itemPrice}>R$ {order.value}</span></li>
        ))}
      </ul>

      {/* Total */}
      <div className={styles.totalPrice}>Total: {order.value ?? 'R$ --'}</div>

      {/* Divisão */}
      <div className={styles.divider}></div>

      {/* Horários */}
      <div className={styles.timingsSection}>
        <div className={styles.timeBlock}>
          <span>🕒 Pedido</span>
          <strong>{order.horarioPedido ?? '--'}</strong>
        </div>
        <div className={styles.timeBlock}>
          <span>⏰ Previsão</span>
          <strong>{order.previsaoEntrega ?? '--'}</strong>
        </div>
        <div className={styles.timeBlock}>
          <span>🔔 Saída</span>
          <strong>{order.horarioSaida ?? '--'}</strong>
        </div>
        <div className={styles.timeBlock}>
          <span>⏳ Entrega</span>
          <strong>{order.horarioEntrega ?? '--'}</strong>
        </div>
      </div>

      {/* Motoboy */}
      <div className={styles.motoboySection}>
        <div className={styles.motoboyLabel}>Motoboy</div>
        {order.motoboy ? (
          <div className={styles.motoboyInfo}>
            {order.motoboy.avatar ? (
              <img src={order.motoboy.avatar} alt="Avatar" className={styles.motoboyAvatar} />
            ) : (
              <div className={styles.motoboyAvatar}>{order.motoboy.name.charAt(0)}</div>
            )}
            <div>
              <div>{order.motoboy.name}</div>
              <div className={order.motoboy.status === 'online' ? styles.statusOnline : styles.statusOffline}>
                {order.motoboy.status === 'online' ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noMotoboy}>Nenhum motoboy atribuido</div>
        )}
      </div>
    </div>
  );
};

export default OrderPopup;