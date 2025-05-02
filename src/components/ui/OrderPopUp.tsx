// components/ui/OrderPopup.tsx
import React from 'react';
import styles from '../../style/OrderPopup.module.css';
import { Order } from './types';

/**
 * Interface para as propriedades do motoboy associado a um pedido
 */
interface OrderMotoboy {
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

/**
 * Interface para as propriedades de um pedido no popup
 */
interface OrderDetails {
  id: number;
  address?: string;
  items: string | string[];
  value?: string;
  status?: string;
  horarioPedido?: string;
  previsaoEntrega?: string;
  horarioSaida?: string;
  horarioEntrega?: string;
  motoboy?: OrderMotoboy;
}

/**
 * Interface para as propriedades do componente OrderPopup
 */
interface OrderPopupProps {
  order: Order;
}

/**
 * Componente que exibe as informações detalhadas de um pedido em um popup no mapa
 * @param order - Objeto contendo as informações do pedido
 */
const OrderPopup: React.FC<OrderPopupProps> = ({ order }) => {
  console.log('Rendering OrderPopup with order:', order);
  // Garante que os itens sempre sejam tratados como array
  const itemsArray = Array.isArray(order.items) ? order.items : [order.items];

  return (
    <div className={styles.container}>
      {/* Cabeçalho do pedido */}
      <div className={styles.header}>Pedido #{order.id}</div>

      {/* Endereço do pedido */}
      <div className={styles.location}>
        <i className="fas fa-map-marker-alt" /> {order.address ?? 'Endereço não informado'}
      </div>

      {/* Lista de itens do pedido */}
      <div className={styles.sectionTitle}>Itens</div>
      <ul className={styles.items}>
        {itemsArray.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      {/* Valor do pedido */}
      <div className={styles.value}>{order.value ?? 'R$ --'}</div>

      {/* Detalhes de tempo */}
      <TimeInformation
        horarioPedido={order.horarioPedido}
        previsaoEntrega={order.previsaoEntrega}
        horarioSaida={order.horarioSaida}
        horarioEntrega={order.horarioEntrega}
      />

      {/* Informações do motoboy */}
      <MotoboyInformation motoboy={order.motoboy} />
    </div>
  );
};

// const OrderPopup: React.FC<{ order: Order }> = ({ order }) => {
//   console.log('OrderPopup data:', order);

//   return (
//     <div className="order-popup">
//       <h3>Pedido #{order.id}</h3>
//       <p>Itens: {order.items}</p>
//       <p>Endereço: {order.address}</p>
//     </div>
//   );
// };

/**
 * Componente para exibir informações de tempo do pedido
 */
const TimeInformation: React.FC<{
  horarioPedido?: string;
  previsaoEntrega?: string;
  horarioSaida?: string;
  horarioEntrega?: string;
}> = ({ horarioPedido, previsaoEntrega, horarioSaida, horarioEntrega }) => (
  <div className={styles.timings}>
    <div>
      <span className={styles.timeLabel}>🕒 Pedido</span>
      <div className={styles.timeValue}>{horarioPedido ?? '--'}</div>
    </div>
    <div>
      <span className={styles.timeLabel}>⏰ Previsão</span>
      <div className={styles.timeValue}>{previsaoEntrega ?? '--'}</div>
    </div>
    <div>
      <span className={styles.timeLabel}>🔔 Saída</span>
      <div className={styles.timeValue}>{horarioSaida ?? '--'}</div>
    </div>
    <div>
      <span className={styles.timeLabel}>⏳ Entrega</span>
      <div className={styles.timeValue}>{horarioEntrega ?? '--'}</div>
    </div>
  </div>
);

/**
 * Componente para exibir informações do motoboy
 */
const MotoboyInformation: React.FC<{ motoboy?: OrderMotoboy }> = ({ motoboy }) => (
  <div className={styles.motoboySection}>
    <div className={styles.motoboyLabel}>Motoboy</div>
    {motoboy ? (
      <div className={styles.motoboyInfo}>
        {motoboy.avatar ? (
          <img src={motoboy.avatar} className={styles.motoboyAvatar} alt="Motoboy" />
        ) : (
          <div className={styles.motoboyAvatar} style={{ backgroundColor: '#ccc' }}>
            {motoboy.name?.charAt(0) ?? 'M'}
          </div>
        )}        <div>
          <div>{motoboy.name}</div>
          <div className={motoboy.status === 'offline' ? styles.statusOffline : styles.statusOnline}>
            {motoboy.status === 'offline' ? '🔴 Offline' : '🟢 Online'}
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.motoboyPlaceholder}>
        Nenhum motoboy atribuído. <button className={styles.assignButton}>Atribuir</button>
      </div>
    )}
  </div>
);

export default OrderPopup;