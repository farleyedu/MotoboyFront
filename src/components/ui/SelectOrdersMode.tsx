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
      style={{ width: '100%', height: '80%' }}
    />
  );
};


/**
 * Hook personalizado para gerenciar o redimensionamento do mapa
 * @param mapRef - Referência para a instância do mapa
 * @param dependencies - Array de dependências que devem disparar o redimensionamento
 */
function useMapResize(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  dependencies: any[]
) {
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Função para redimensionar o mapa
    const resizeMap = () => {
      // Verificamos se o mapa ainda existe
      if (mapRef.current) {
        // Usamos setTimeout para garantir que o DOM foi atualizado
        setTimeout(() => {
          mapRef.current?.resize();
        }, 100);
        
        // Também tentamos um segundo resize após mais tempo
        // para garantir que todas as transições de CSS foram concluídas
        setTimeout(() => {
          mapRef.current?.resize();
        }, 300);
      }
    };
    
    // Executamos o resize imediatamente
    resizeMap();
    
    // Criamos um observador de redimensionamento para capturar mudanças na janela
    const resizeObserver = new ResizeObserver((entries) => {
      resizeMap();
    });
    
    // Encontramos o container do mapa
    const mapContainer = mapRef.current.getContainer();
    
    // Observamos o container do mapa
    if (mapContainer) {
      resizeObserver.observe(mapContainer);
    }
    
    // Também observamos a janela para mudanças gerais
    window.addEventListener('resize', resizeMap);
    
    // Limpeza
    return () => {
      if (mapContainer) {
        resizeObserver.unobserve(mapContainer);
      }
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
  
  // Definir o centro do mapa - pegando a média das coordenadas dos pedidos
  // ou usando um valor padrão se não houver pedidos
  const mapCenter: Coordinates = orders.length > 0
    ? [
        orders.reduce((acc, order) => acc + order.coordinates[0], 0) / orders.length,
        orders.reduce((acc, order) => acc + order.coordinates[1], 0) / orders.length
      ]
    : [-48.2772, -18.9146];

  // Callback para quando o mapa é carregado
  const handleMapLoaded = (map: mapboxgl.Map) => {
    // Adicionar marcadores para os pedidos
    orders.forEach((order) => {
      const markerElement = createMarkerElement(order);

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat(order.coordinates)
        .addTo(map);

      markersRef.current[order.id] = marker;
    });
  };

  // Inicialização do mapa usando o hook personalizado
  const mapRef = useMapInitialization(
    mapContainer,
    mapCenter,
    true, // sempre ativo
    handleMapLoaded
  );

  // Usando o hook personalizado para gerenciar o redimensionamento do mapa
  useMapResize(mapRef, [isChatOpen]);

  // Função para criar o elemento HTML do marcador
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
      el.style.backgroundColor = '#3498db'; // muda cor se quiser
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
      el.style.backgroundColor = selectedOrders.find(o => o.id === order.id) ? '#1abc9c' : '#e74c3c';
    });

    return el;
  };

  // Função para alternar a seleção de um pedido
  const toggleOrder = (order: Order) => {
    setSelectedOrders((prev) => {
      if (prev.find(o => o.id === order.id)) {
        return prev.filter(o => o.id !== order.id);
      } else {
        return [...prev, order];
      }
    });
  };

  // Atualizar a aparência dos marcadores quando a seleção muda
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const isSelected = selectedOrders.find(o => o.id === parseInt(id));
      el.style.backgroundColor = isSelected ? '#1abc9c' : '#e74c3c';
    });
  }, [selectedOrders]);

  // Confirmar a seleção
  const handleConfirm = () => {
    if (selectedOrders.length > 0 && selectedMotoboy) {
      onConfirm(selectedOrders, selectedMotoboy);
    }
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      data-chat-open={isChatOpen ? 'true' : 'false'}
    >
<MapOnly mapContainer={mapContainer} />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '12px'
        }}>
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
                transition: 'transform 0.2s ease, background-color 0.2s ease',
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

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px'
        }}>
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
          <div style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              Pedidos selecionados:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selectedOrders.map(order => (
                <span key={order.id} style={{
                  padding: '2px 6px',
                  backgroundColor: '#1abc9c',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
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
