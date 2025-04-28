import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Order, Motoboy } from '../ui/types';

interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: Motoboy[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: Motoboy) => void;
  onCancel: () => void;
  isChatOpen: boolean; // <- Adicionado!
}

export default function SelectOrdersMode({ orders, motoboys, onConfirm, onCancel, isChatOpen }: SelectOrdersModeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const markersRef = useRef<Record<number, mapboxgl.Marker>>({});

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      requestAnimationFrame(() => {
        mapRef.current?.resize();
      });
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-48.2772, -18.9146],
      zoom: 13,
    });

    mapRef.current = map;

    map.on('load', () => {
      orders.forEach((order) => {
        const markerElement = createMarkerElement(order);

        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat(order.coordinates)
          .addTo(map);

        markersRef.current[order.id] = marker;
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  const createMarkerElement = (order: Order) => {
    const el = document.createElement('div');
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.backgroundColor = selectedOrders.find(o => o.id === order.id) ? '#1abc9c' : '#e74c3c';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';

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

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const isSelected = selectedOrders.find(o => o.id === parseInt(id));
      el.style.backgroundColor = isSelected ? '#1abc9c' : '#e74c3c';
    });
  }, [selectedOrders]);

  const handleConfirm = () => {
    if (selectedOrders.length > 0 && selectedMotoboy) {
      onConfirm(selectedOrders, selectedMotoboy);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '80%' }} />

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', padding: '12px' }}>
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
            }}
          >
            {motoboy.name[0]}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '12px' }}>
        <button onClick={handleConfirm} disabled={!selectedMotoboy || selectedOrders.length === 0}>
          Confirmar
        </button>
        <button onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
