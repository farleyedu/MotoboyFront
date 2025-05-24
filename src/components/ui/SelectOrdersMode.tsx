import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Order, Motoboy, Coordinates, MotoboyComPedidosDTO } from '../ui/types';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import styles from '../../style/SelectOrdersMode.module.css'; // Importando o CSS Module

interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: MotoboyComPedidosDTO[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: MotoboyComPedidosDTO) => void;
  onCancel: () => void;
  isChatOpen: boolean;
}

const MapOnly = ({ mapContainer }: { mapContainer: React.RefObject<HTMLDivElement | null> }) => {
  return <div ref={mapContainer} className={styles.mapContainer} />;
};

export default function SelectOrdersMode({ orders, motoboys, onConfirm, onCancel, isChatOpen }: SelectOrdersModeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<MotoboyComPedidosDTO | null>(null);
  const markersRef = useRef<Record<number, mapboxgl.Marker>>({});
  const [showMotoboyWarning, setShowMotoboyWarning] = useState(false);

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



  const validOrders = orders.filter(
    o => Array.isArray(o.coordinates) && o.coordinates.length === 2
  );
  
  const mapCenter: Coordinates = [-48.2768, -18.9186]; // Centro aproximado de Uberlândia
  const mapZoom = 10; // Mostra a cidade inteira



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

    // ⚠️ Removido position/align/etc do el

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = '/assets/img/pinPNG.png';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.pointerEvents = 'none';
    img.style.transition = 'transform 0.2s ease';
    img.setAttribute('data-marker-img', 'true');

    const badge = document.createElement('div');
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
    badge.style.transition = 'opacity 0.2s ease';

    wrapper.appendChild(img);
    wrapper.appendChild(badge);
    el.appendChild(wrapper);

    el.setAttribute('data-selected', 'false');

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
    if (!selectedMotoboy) {
      setShowMotoboyWarning(true);
      setTimeout(() => setShowMotoboyWarning(false), 2000);
      return;
    }

    if (selectedOrders.length > 0) {
      onConfirm(selectedOrders, selectedMotoboy);
    }
  };

  return (
    <div className={styles.container} style={{ zIndex: isChatOpen ? 10 : 5 }}>
      <div className={styles.mapContainer} ref={mapContainer}>
        <div className={styles.overlay}>
          {showMotoboyWarning && (
            <div className={styles.warningText}>
              Selecione um motoboy primeiro
            </div>
          )}
          <div className={styles.motoboyList}>
            {motoboys
              .filter(m => m.status === 'online')
              .map((motoboy) => (
                <div
                  key={motoboy.id}
                  onClick={() => setSelectedMotoboy(motoboy)}
                  className={`${styles.motoboy} ${selectedMotoboy?.id === motoboy.id ? styles.motoboySelected : ''}`}
                >
                  {motoboy.nome[0]}
                </div>
              ))}
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleConfirm}
              disabled={false}
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
