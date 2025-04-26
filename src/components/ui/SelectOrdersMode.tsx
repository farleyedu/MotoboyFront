import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Order, Motoboy } from '../ui/types';

interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: Motoboy[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: Motoboy) => void;
  onCancel: () => void;
}

export default function SelectOrdersMode({ orders, motoboys, onConfirm, onCancel }: SelectOrdersModeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-48.2772, -18.9146], // Centro padrão Uberlândia ou sua pizzaria
      zoom: 13,
    });

    orders.forEach((order) => {
      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = selectedOrders.includes(order) ? '#1abc9c' : '#e74c3c';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(order.coordinates)
        .addTo(mapRef.current!);

      el.addEventListener('click', () => {
        toggleOrder(order);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [orders, selectedOrders]);

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
