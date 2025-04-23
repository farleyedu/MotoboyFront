// components/ui/OrderPopup.tsx
import React from 'react';
import styles from '../../style/OrderPopup.module.css'; // ou o caminho correto do seu CSS

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
    return (
        <div className={styles.container}>
            <div className={styles.header}>Pedido #102</div>
            <div className={styles.location}>
                <i className="fas fa-map-marker-alt" /> Av. João Naves, 2121, Centro
            </div>

            <div className={styles.sectionTitle}>Itens</div>
            <ul className={styles.items}>
                <li>• Pizza Calabresa</li>
                <li>• Coca 2L</li>
            </ul>

            <div className={styles.value}>R$ 45,00</div>

            <div className={styles.timings}>
                <div><span className={styles.timeLabel}>🕒 Pedido</span><div className={styles.timeValue}>19:20</div></div>
                <div><span className={styles.timeLabel}>⏰ Previsão</span><div className={styles.timeValue}>19:40</div></div>
                <div><span className={styles.timeLabel}>🔔 Saída</span><div className={styles.timeValue}>19:40</div></div>
                <div><span className={styles.timeLabel}>⏳ Entrega</span><div className={styles.timeValue}>20:00</div></div>
            </div>

            <div className={styles.motoboySection}>
                <div className={styles.motoboyLabel}>Motoboy</div>
                <div className={styles.motoboyInfo}>
                    <img src="/img/motoboy-avatar.jpg" className={styles.motoboyAvatar} alt="Motoboy" />
                    <div>
                        <div>Pedro Oliveira</div>
                        <div className={styles.statusOnline}>🟢 Online</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPopup;
