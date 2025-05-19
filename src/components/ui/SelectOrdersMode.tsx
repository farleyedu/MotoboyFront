import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Order, Motoboy, Coordinates } from '../ui/types';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import styles from '../../style/SelectOrdersMode.module.css'; // Importando o CSS Module

interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: Motoboy[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: Motoboy) => void;
  onCancel: () => void;
  isChatOpen: boolean;
}

const MapOnly = ({ mapContainer }: { mapContainer: React.RefObject<HTMLDivElement | null> }) => {
  return <div ref={mapContainer} className={styles.mapContainer} />;
};

export default function SelectOrdersMode({ orders, motoboys, onConfirm, onCancel, isChatOpen }: SelectOrdersModeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const markersRef = useRef<Record<number, mapboxgl.Marker>>({});

  useEffect(() => {
    selectedOrders.forEach((order, index) => {
      const marker = markersRef.current[order.id];
      if (!marker) return;
  
      const el = marker.getElement();
      const badge = el.querySelector('[data-badge]') as HTMLDivElement | null;
  
      if (badge) {
        badge.innerText = (index + 1).toString();
      }
    });
  
    // Remover número de quem não está mais selecionado
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const badge = el.querySelector('[data-badge]') as HTMLDivElement | null;
      const stillSelected = selectedOrders.find(o => o.id === parseInt(id));
      if (!stillSelected && badge) {
        badge.innerText = '';
      }
    });
  }, [selectedOrders]);
  


  const mapCenter: Coordinates =
    orders.length > 0
      ? [
          orders.reduce((acc, order) => acc + order.coordinates[0], 0) / orders.length,
          orders.reduce((acc, order) => acc + order.coordinates[1], 0) / orders.length,
        ]
      : [-48.2772, -18.9146];

  const handleMapLoaded = (map: mapboxgl.Map) => {
    orders.forEach((order) => {
      const markerElement = createMarkerElement(order);
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat(order.coordinates)
        .addTo(map);
      markersRef.current[order.id] = marker;
    });
  };

  const mapRef = useMapInitialization(mapContainer, mapCenter, true, handleMapLoaded);

  const createMarkerElement = (order: Order) => {
    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.cursor = 'pointer';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.position = 'relative';
    el.setAttribute('data-selected', 'false');
  
    const img = document.createElement('img');
    img.src = '/assets/img/pinPNG.png';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.pointerEvents = 'none';
    img.style.transition = 'transform 0.2s ease';
    img.setAttribute('data-marker-img', 'true');
    el.appendChild(img);
  
    const badge = document.createElement('div');
    badge.className = 'order-number-badge';
    badge.setAttribute('data-badge', 'true');
    badge.style.position = 'absolute';
    badge.style.top = '50%';
    badge.style.left = '50%';
    badge.style.transform = 'translate(-50%, -50%)';
    badge.style.color = 'white';
    badge.style.fontWeight = 'bold';
    badge.style.fontSize = '14px';
    badge.style.textShadow = '0 0 2px black';
    badge.style.pointerEvents = 'none';
    badge.style.zIndex = '2';
    el.appendChild(badge);
  
    el.addEventListener('click', () => {
      const isAlreadySelected = el.getAttribute('data-selected') === 'true';
  
      if (isAlreadySelected) {
        img.style.transform = 'scale(1)';
        el.setAttribute('data-selected', 'false');
        setSelectedOrders((prev) => prev.filter(o => o.id !== order.id));
      } else {
        img.style.transform = 'scale(1.4)';
        el.setAttribute('data-selected', 'true');
        setSelectedOrders((prev) => [...prev, order]);
      }
    });
  
    return el;
  };
  
  

  const handleConfirm = () => {
    if (selectedOrders.length > 0 && selectedMotoboy) {
      onConfirm(selectedOrders, selectedMotoboy);
    }
  };

  return (
    <div className={styles.container} style={{ zIndex: isChatOpen ? 10 : 5 }}>
      <div className={styles.mapContainer} ref={mapContainer}>
        <div className={styles.overlay}>
          <div className={styles.motoboyList}>
            {motoboys.map((motoboy) => (
              <div
                key={motoboy.id}
                onClick={() => setSelectedMotoboy(motoboy)}
                className={`${styles.motoboy} ${selectedMotoboy?.id === motoboy.id ? styles.motoboySelected : ''}`}
              >
                {motoboy.name[0]}
              </div>
            ))}
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleConfirm}
              disabled={!selectedMotoboy || selectedOrders.length === 0}
              className={styles.confirmButton}
            >
              Confirmar ({selectedOrders.length}) pedidos
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              Cancelar
            </button>
          </div>

          {selectedOrders.length > 0 && (
            <div className={styles.selectedOrders}>
              <div className={styles.selectedOrdersTitle}>Pedidos selecionados:</div>
              <div className={styles.selectedOrdersList}>
                {selectedOrders.map((order) => (
                  <span key={order.id} className={styles.orderBadge}>
                    #{order.id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
