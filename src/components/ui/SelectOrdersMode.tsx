// SelectOrdersMode.tsx (corrigido)

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Order, Motoboy, Coordinates } from '../ui/types';
import useMapInitialization from '../../lib/hooks/useMapInitialization';

interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: Motoboy[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: Motoboy) => void;
  onCancel: () => void;
  isChatOpen: boolean;
}

const MapOnly = ({ mapContainer }: { mapContainer: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={mapContainer}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '30%' }}
    />
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapOnly mapContainer={mapContainer} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        backgroundColor: 'white',
        padding: '12px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {motoboys.map((motoboy) => (
            <div
              key={motoboy.id}
              onClick={() => setSelectedMotoboy(motoboy)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: selectedMotoboy?.id === motoboy.id ? '#3498db' : '#bdc3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease, background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {motoboy.name[0]}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={handleConfirm}
            disabled={!selectedMotoboy || selectedOrders.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: (!selectedMotoboy || selectedOrders.length === 0) ? '#e0e0e0' : '#1abc9c',
              color: (!selectedMotoboy || selectedOrders.length === 0) ? '#888' : 'white',
              border: 'none',
              cursor: (!selectedMotoboy || selectedOrders.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease'
            }}
          >
            Confirmar ({selectedOrders.length}) pedidos
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease'
            }}
          >
            Cancelar
          </button>
        </div>

        {selectedOrders.length > 0 && (
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '14px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Pedidos selecionados:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selectedOrders.map(order => (
                <span key={order.id} style={{ padding: '2px 6px', backgroundColor: '#1abc9c', color: 'white', borderRadius: '12px', fontSize: '12px' }}>
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
