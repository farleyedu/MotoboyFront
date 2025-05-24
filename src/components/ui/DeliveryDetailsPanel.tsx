'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import styles from '../../style/DeliveryDetailsPanel.module.css';
import { DeliveryDetailsPanelProps } from './types';

const DeliveryDetailsPanel: FC<DeliveryDetailsPanelProps> = ({ 
  motoboy, 
  pendingOrders, 
  onClose, 
  onAssignOrder 
}) => {
  if (!motoboy) return null;

  const currentDeliveries = motoboy.pedidos.filter(d => d.status === 'em_rota');
  const nextDeliveries = motoboy.pedidos.filter(d => d.status === 'proxima');

  return (
    <div className={styles.deliveryDetailsPanel}>
      <div className={styles.panelHeader}>
        <h3>Detalhes do Motoboy</h3>
        <button 
          className={styles.btnClose}
          onClick={onClose}
          aria-label="Fechar painel"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className={styles.motoboyProfile}>
        <Image 
          src={motoboy.avatar || 'https://via.placeholder.com/80'} 
          alt={`Foto de ${motoboy.nome}`} 
          width={80}
          height={80}
          className={styles.motoboyAvatarLarge}
        />
        <div className={styles.profileInfo}>
          <h4>{motoboy.nome}</h4>
          <p><i className="fas fa-phone"></i> {motoboy.phone || '(Telefone não disponível)'}</p>
          <p><i className="fas fa-motorcycle"></i> {motoboy.vehicle || 'Veículo não especificado'}</p>
          <div className={`${styles.status} ${styles[motoboy.status]}`}>
            {motoboy.status === 'online' ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
      
      <div className={styles.currentDeliveries}>
        <h4>Entregas em Andamento ({motoboy.pedidos.length})</h4>
        
        {currentDeliveries.map(delivery => (
          <div key={delivery.id} className={`${styles.deliveryItem} ${styles.current}`}>
            <div className={styles.deliveryStatus}>
              <div className={styles.statusIcon}><i className="fas fa-route"></i></div>
              <div className={styles.statusLine}></div>
            </div>
            <div className={styles.deliveryContent}>
              <div className={styles.deliveryHeader}>
                <h5>Pedido #{delivery.id} - Em rota</h5>
                <span className={styles.time}>Saiu às {delivery.departureTime}</span>
              </div>
              <p className={styles.address}>
                <i className="fas fa-map-marker-alt"></i> {delivery.address}
              </p>
              <div className={styles.deliveryDetails}>
                <span><i className="fas fa-pizza-slice"></i> {delivery.items}</span>
                <span><i className="fas fa-money-bill-wave"></i> {delivery.value}</span>
              </div>
              <div className={styles.eta}>
                Chegada estimada: {delivery.eta}
                {delivery.etaMinutes > 0 && ` (${delivery.etaMinutes} min)`}
              </div>
            </div>
          </div>
        ))}
        
        {nextDeliveries.map(delivery => (
          <div key={delivery.id} className={`${styles.deliveryItem} ${styles.next}`}>
            <div className={styles.deliveryStatus}>
              <div className={styles.statusIcon}><i className="fas fa-clock"></i></div>
              <div className={styles.statusLine}></div>
            </div>
            <div className={styles.deliveryContent}>
              <div className={styles.deliveryHeader}>
                <h5>Pedido #{delivery.id} - Próxima entrega</h5>
                <span className={styles.time}>Saiu às {delivery.departureTime}</span>
              </div>
              <p className={styles.address}>
                <i className="fas fa-map-marker-alt"></i> {delivery.address}
              </p>
              <div className={styles.deliveryDetails}>
                <span><i className="fas fa-pizza-slice"></i> {delivery.items}</span>
                <span><i className="fas fa-money-bill-wave"></i> {delivery.value}</span>
              </div>
              <div className={styles.eta}>Chegada estimada: {delivery.eta}</div>
            </div>
          </div>
        ))}
        
        {motoboy.pedidos.length === 0 && (
          <p className={styles.noDeliveries}>Nenhuma entrega em andamento</p>
        )}
      </div>
      
      <div className={styles.addDeliverySection}>
        <h4>Adicionar Entrega</h4>
        {pendingOrders.length > 0 ? (
          <div className={styles.pendingOrders}>
            {pendingOrders.map(order => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <h5>Pedido #{order.id}</h5>
                  <p>
                    <i className="fas fa-map-marker-alt"></i> 
                    {order.enderecoEntrega || `Região: ${order.region || 'Não especificada'}`}
                  </p>
                  <p>
                    <i className="fas fa-pizza-slice"></i> 
                    {Array.isArray(order.items) ? order.items.join(', ') : order.items || 'Itens não especificados'}
                  </p>
                </div>
                <button 
                  className={styles.btnAssign}
                  onClick={() => onAssignOrder(motoboy.id, order.id)}
                >
                  Atribuir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noPendingOrders}>Não há pedidos pendentes para atribuição</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetailsPanel;
