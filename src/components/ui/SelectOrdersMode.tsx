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
  return (
    <div ref={mapContainer} className={styles.mapContainer} />
  );
};

export default function SelectOrdersMode({ orders, motoboys, onConfirm, onCancel, isChatOpen }: SelectOrdersModeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const markersRef = useRef<Record<number, mapboxgl.Marker>>({});

  const mapCenter: Coordinates = orders.length > 0
    ? [
        orders.reduce((acc, order) => acc + order.coordinates[0], 0) / orders.length,
        orders.reduce((acc, order) => acc + order.coordinates[1], 0) / orders.length
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

  function useMapResize(
    mapRef: React.MutableRefObject<mapboxgl.Map | null>,
    dependencies: any[]
  ) {
    useEffect(() => {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const el = marker.getElement();
    
        // Limpa o conteúdo anterior
        el.innerHTML = '';
    
        const img = document.createElement('img');
        img.src = '/assets/img/pinPNG.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        img.style.pointerEvents = 'none';
    
        el.appendChild(img);
    
        const isSelected = selectedOrders.findIndex(o => o.id === parseInt(id));
        if (isSelected !== -1) {
          const numberBadge = document.createElement('div');
          numberBadge.innerText = (isSelected + 1).toString();
          numberBadge.style.position = 'absolute';
          numberBadge.style.top = '50%';
          numberBadge.style.left = '50%';
          numberBadge.style.transform = 'translate(-50%, -50%)';
          numberBadge.style.color = 'white';
          numberBadge.style.fontWeight = 'bold';
          numberBadge.style.fontSize = '16px';
          numberBadge.style.textShadow = '0 0 2px black';
          el.appendChild(numberBadge);
        }
      });
    }, [selectedOrders]);
    
  }

  const mapRef = useMapInitialization(mapContainer, mapCenter, true, handleMapLoaded);
  useMapResize(mapRef, [isChatOpen]);

  const createMarkerElement = (order: Order) => {
    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.position = 'relative'; // RELATIVE, não absolute
    el.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = '/assets/img/pinPNG.png';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.pointerEvents = 'none';
    
    el.appendChild(img);
  
    el.addEventListener('click', () => toggleOrder(order));
  
    return el;
  };
  
  
  
  


  const toggleOrder = (order: Order) => {
    setSelectedOrders((prev) => {
      if (prev.find(o => o.id === order.id)) {
        return prev.filter(o => o.id !== order.id);
      } else {
        return [...prev, order];
      }
    });
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
            <button
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>

          {selectedOrders.length > 0 && (
            <div className={styles.selectedOrders}>
              <div className={styles.selectedOrdersTitle}>Pedidos selecionados:</div>
              <div className={styles.selectedOrdersList}>
                {selectedOrders.map(order => (
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
