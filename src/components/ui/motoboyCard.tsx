import React from 'react';
import styles from '../../style/MotoboyCard.module.css';
import { Motoboy, Delivery } from './types';
import Image from 'next/image';

interface Props {
    motoboy: Motoboy;
    onLocateMotoboy: (id: number) => void;
    onShowDetails: (id: number) => void;
    onHoverPedido: (pedido: Delivery, index: number, all: Delivery[]) => void;
    isActive: boolean;
}

const MotoboyCard: React.FC<Props> = ({
    motoboy,
    onLocateMotoboy,
    onShowDetails,
    onHoverPedido,
    isActive,
}) => {
    const imageUrl = motoboy.avatar?.startsWith('http')
        ? motoboy.avatar
        : '/img/perfil-motoboy.jpg';

    return (
        <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.left}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={imageUrl}
                            alt={motoboy.name}
                            width={36}
                            height={36}
                            className={styles.avatar}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/img/perfil-motoboy.jpg';
                            }}
                        />
                    </div>
                    <div className={styles.titleBlock}>
                        <h4 className={styles.name}>{motoboy.name}</h4>
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

        </div>
    );
};

export default MotoboyCard;
