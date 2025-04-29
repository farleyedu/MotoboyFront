// SelectOrdersMode.tsx (refatorado para usar CSS Modules)

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

function useMapResize(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  dependencies: any[]
) {
  useEffect(() => {
    if (!mapRef.current) return;

    const resizeMap = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.resize();
        }, 100);
        setTimeout(() => {
          mapRef.current?.resize();
        }, 300);
      }
    };

    resizeMap();

    const resizeObserver = new ResizeObserver(() => resizeMap());
    const mapContainer = mapRef.current.getContainer();

    if (mapContainer) {
      resizeObserver.observe(mapContainer);
    }

    window.addEventListener('resize', resizeMap);

    return () => {
      if (mapContainer) resizeObserver.unobserve(mapContainer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeMap);
    };
  }, dependencies);
}

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

  const mapRef = useMapInitialization(mapContainer, mapCenter, true, handleMapLoaded);
  useMapResize(mapRef, [isChatOpen]);

  const createMarkerElement = (order: Order) => {
    const el = document.createElement('div');
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.backgroundColor = selectedOrders.find(o => o.id === order.id) ? '#1abc9c' : '#e74c3c';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    el.style.transition = 'background-color 0.05s linear';

    el.addEventListener('click', () => toggleOrder(order));
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.5)';
      el.style.backgroundColor = '#3498db';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
      el.style.backgroundColor = selectedOrders.find(o => o.id === order.id) ? '#1abc9c' : '#e74c3c';
    });

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
    <div className={styles.container}>
      <MapOnly mapContainer={mapContainer} />

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
  );
}
