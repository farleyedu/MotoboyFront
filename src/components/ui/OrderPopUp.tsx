// components/ui/OrderPopup.tsx
import React from 'react';
import styles from '../../style/OrderPopup.module.css';

interface OrderPopupProps {
  order: {
    id: number;
    address?: string;
    items: string | string[];
    value?: string;
    status?: string;
    horarioPedido?: string;
    previsaoEntrega?: string;
    horarioSaida?: string;
    horarioEntrega?: string;
    motoboy?: {
      name: string;
      avatar: string;
      status: 'online' | 'offline';
    };
  };
}

const OrderPopup: React.FC<OrderPopupProps> = ({ order }) => {
  const itemsArray = Array.isArray(order.items) ? order.items : [order.items];
  console.log('Order items:', order); // Debugging line to check the items array
  return (
    <div className={styles.container}>
      <div className={styles.header}>Pedido #{order.id}</div>

      <div className={styles.location}>
        <i className="fas fa-map-marker-alt" /> {order.address ?? 'Endereço não informado'}
      </div>

      <div className={styles.sectionTitle}>Itens</div>
      <ul className={styles.items}>
        {itemsArray.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      <div className={styles.value}>{order.value ?? 'R$ --'}</div>

      <div className={styles.timings}>
        <div><span className={styles.timeLabel}>🕒 Pedido</span><div className={styles.timeValue}>{order.horarioPedido ?? '--'}</div></div>
        <div><span className={styles.timeLabel}>⏰ Previsão</span><div className={styles.timeValue}>{order.previsaoEntrega ?? '--'}</div></div>
        <div><span className={styles.timeLabel}>🔔 Saída</span><div className={styles.timeValue}>{order.horarioSaida ?? '--'}</div></div>
        <div><span className={styles.timeLabel}>⏳ Entrega</span><div className={styles.timeValue}>{order.horarioEntrega ?? '--'}</div></div>
      </div>

      <div className={styles.motoboySection}>
        <div className={styles.motoboyLabel}>Motoboy</div>
        {order.motoboy ? (
          <div className={styles.motoboyInfo}>
            <img src={order.motoboy.avatar} className={styles.motoboyAvatar} alt="Motoboy" />
            <div>
              <div>{order.motoboy.name}</div>
              <div className={order.motoboy.status === 'offline' ? styles.statusOffline : styles.statusOnline}>
                {order.motoboy.status === 'offline' ? '🔴 Offline' : '🟢 Online'}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.motoboyPlaceholder}>
            Nenhum motoboy atribuído. <button className={styles.assignButton}>Atribuir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPopup;
