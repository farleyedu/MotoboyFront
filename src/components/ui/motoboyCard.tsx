import React from 'react';
import { Motoboy, Delivery } from './types';
import styles from '../../style/MotoboyCard.module.css';

interface Props {
    motoboy?: Motoboy;
    onLocateMotoboy?: (id: number) => void;
    onShowDetails?: (id: number) => void;
    onHoverPedido?: (pedido: Delivery, index: number, all: Delivery[]) => void;
    isActive?: boolean;
}

const MotoboyCard: React.FC<Props> = ({
    motoboy,
    onLocateMotoboy = () => { },
    onShowDetails = () => { },
    onHoverPedido = () => { },
    isActive = false,
}) => {
    const mockMotoboy: Motoboy = {
        id: 1,
        name: 'Michael Scott',
        status: 'online',
        avatar: '',
        location: [-48.28, -18.91],
        deliveries: [
            { id: 1240, status: 'em_rota', address: '', items: '', value: '', departureTime: '', eta: '', etaMinutes: 0, coordinates: [0, 0] },
            { id: 1238, status: 'em_rota', address: '', items: '', value: '', departureTime: '', eta: '', etaMinutes: 0, coordinates: [0, 0] },
            { id: 1234, status: 'concluida', address: '', items: '', value: '', departureTime: '', eta: '', etaMinutes: 0, coordinates: [0, 0] },
            { id: 1250, status: 'proxima', address: '', items: '', value: '', departureTime: '', eta: '', etaMinutes: 8, coordinates: [0, 0] },
        ],
    };

    const finalMotoboy = motoboy || mockMotoboy;
    const imageUrl = finalMotoboy.avatar?.startsWith('http')
        ? finalMotoboy.avatar
        : '/img/perfil-motoboy.jpg';

    const retirados = finalMotoboy.deliveries.filter((d) => d.status === 'em_rota');
    const concluidas = finalMotoboy.deliveries.filter((d) => d.status === 'concluida');
    const proxima = finalMotoboy.deliveries.find((d) => d.status === 'proxima');

    return (
        <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.left}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={imageUrl}
                            alt={finalMotoboy.name}
                            className={styles.avatar}
                            width={36}
                            height={36}
                            onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (!target.src.includes('/img/perfil-motoboy.jpg')) {
                                    target.src = '/img/perfil-motoboy.jpg';
                                }
                            }}
                        />
                    </div>
                    <div className={styles.titleBlock}>
                        <h4 className={styles.name}>{finalMotoboy.name}</h4>
                        <span className={`${styles.status} ${styles[`status-${finalMotoboy.status}`]}`}>
                            {finalMotoboy.status}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={() => onLocateMotoboy(finalMotoboy.id)}>
                        <i className="fas fa-map-marker-alt" />
                    </button>
                    <button onClick={() => onShowDetails(finalMotoboy.id)}>
                        <i className="fas fa-ellipsis-v" />
                    </button>
                </div>
            </div>


            <div className={styles.detalhes}>
                <div className={styles.secaoFull}>
                    <div className={styles.secaoTitulo}>Últimos Pedidos Retirados</div>
                    <div className={styles.pedidosLista}>
                        {retirados.map((pedido) => (
                            <span key={pedido.id} className={`${styles.badge} ${styles.badgeRetirado}`}>
                                #{pedido.id}
                            </span>
                        ))}
                        {concluidas.map((pedido) => (
                            <span key={pedido.id} className={`${styles.badge} ${styles.badgeConcluida}`}>
                                <span className={styles.icon}>✅</span> {pedido.id}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles.secaoRow}>
                    <div className={styles.secaoColumn}>
                        <div className={styles.secaoTitulo}>Entregues anteriormente</div>
                        <div className={styles.checkIcon}>✅</div>
                    </div>
                    <div className={styles.secaoColumn}>
                        <div className={styles.secaoTitulo}>Próxima Entrega</div>
                        {proxima && (
                            <span className={`${styles.badge} ${styles.badgeProxima}`}>
                                ETA {proxima.etaMinutes} min
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MotoboyCard;
