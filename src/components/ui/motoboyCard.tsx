import React from 'react';
import { Motoboy, Delivery, MotoboyComPedidosDTO } from './types';
import styles from '../../style/MotoboyCard.module.css';

interface Props {
    motoboy: MotoboyComPedidosDTO;
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
    const imageUrl = motoboy.avatar?.startsWith('http')
        ? motoboy.avatar
        : 'assets/img/perfil-motoboy.jpg';

    const retirados = (motoboy.pedidos ?? []).filter((d) => d.status === 'em_rota');
    const concluidas = (motoboy.pedidos ?? []).filter((d) => d.status === 'concluida');
    const proxima = (motoboy.pedidos ?? []).find((d) => d.status === 'proxima');

    return (
        <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.left}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={imageUrl}
                            alt={motoboy.nome}
                            className={styles.avatar}
                            width={36}
                            height={36}
                            onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (!target.src.includes('assets/img/perfil-motoboy.jpg')) {
                                    target.src = 'assets/img/perfil-motoboy.jpg';
                                }
                            }}
                        />
                    </div>
                    <div className={styles.titleBlock}>
                        <h4 className={styles.name}>{motoboy.nome}</h4>
                        <span className={`${styles.status} ${styles[`status-${motoboy.status}`]}`}>
                            {motoboy.status}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={() => onLocateMotoboy(motoboy.id)}>
                        <i className="fas fa-map-marker-alt" />
                    </button>
                    <button onClick={() => onShowDetails(motoboy.id)}>
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
