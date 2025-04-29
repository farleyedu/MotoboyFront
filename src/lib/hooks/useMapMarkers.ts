import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates, Motoboy, Order, MarkerRef } from '../../components/ui/types';
import ReactDOM from 'react-dom/client';
import React from 'react';
import OrderPopup from '../../components/ui/OrderPopUp';
/**
 * Hook para gerenciar marcadores no mapa Mapbox
 * 
 * @param map - Referência para a instância do mapa Mapbox
 * @param motoboys - Array de motoboys para criar marcadores
 * @param orders - Array de pedidos para criar marcadores
 * @param styles - Estilos CSS para os marcadores
 * @param activeMotoboyId - ID do motoboy atualmente ativo
 * @param isExpandedMap - Flag indicando se é o mapa expandido
 * @param OrderPopupComponent - Componente React para o popup de pedidos
 * 
 * @returns Funções e referências para gerenciar os marcadores
 */
export function useMapMarkers(
  map: mapboxgl.Map | null,
  motoboys: Motoboy[],
  orders: Order[],
  styles: Record<string, string>,
  activeMotoboyId: number | null,
  isExpandedMap: boolean,
  OrderPopupComponent: React.ComponentType<{ order: Order }>,
  baseLocation: Coordinates
) {
  // Refs para armazenar marcadores
  const motoboyMarkers = useRef<MarkerRef[]>([]);
  const orderMarkers = useRef<mapboxgl.Marker[]>([]);

  // Limpa todos os marcadores quando o componente é desmontado
  useEffect(() => {
    return () => {
      clearAllMarkers();
    };
  }, []);

  /**
   * Limpa todos os marcadores do mapa
   */
  const clearAllMarkers = () => {
    motoboyMarkers.current.forEach(marker => marker.marker.remove());
    motoboyMarkers.current = [];

    orderMarkers.current.forEach(marker => marker.remove());
    orderMarkers.current = [];
  };

  /**
   * Adiciona um marcador para a localização base (ex: pizzaria)
   */
  const addBaseMarker = () => {
    if (!map) return;

    new mapboxgl.Marker({ color: '#e74c3c', scale: 1.2 })
      .setLngLat(baseLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Pizzaria</h3><p>Sede</p>'))
      .addTo(map);
  };

  /**
   * Adiciona marcadores para cada motoboy no mapa
   */
  const addMotoboyMarkers = () => {
    if (!map) return;

    motoboys.forEach(motoboy => {
      const el = document.createElement('div');
      el.className = styles.motoboyMarker;
      el.innerHTML = motoboy.name.charAt(0);

      if (motoboy.id === activeMotoboyId) {
        el.classList.add(styles.activeMotoboy);
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="${styles.markerPopup}">
          <h3>${motoboy.name}</h3>
          <p>${motoboy.deliveries.length} entregas em andamento</p>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(motoboy.location)
        .setPopup(popup)
        .addTo(map);

      motoboyMarkers.current.push({
        id: motoboy.id,
        marker,
        element: el,
        isExpandedMap
      });
    });
  };

  /**
   * Adiciona marcadores para cada pedido no mapa
   */
  const addOrderMarkers = (targetMap: mapboxgl.Map) => {
    orders.forEach(order => {
      const coords = order.coordinates;
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.position = 'relative';
      el.style.cursor = 'pointer';
  
      const img = document.createElement('img');
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none';
  
      // Define o ícone correto baseado no status
      switch (order.status) {
        case 'pendente':
          img.src = '/assets/img/order-pendente.png';
          break;
        case 'em_rota':
          img.src = '/assets/img/order-emrota.png';
          break;
        case 'concluida':
          img.src = '/assets/img/order-concluido.png';
          break;
        default:
          img.src = '/assets/img/order-pendente.png'; // Padrão
          break;
      }
  
      el.appendChild(img);
  
      // Criar popup React
      const popupDiv = document.createElement('div');
      document.body.appendChild(popupDiv); // Adiciona o elemento ao DOM
  
      const root = ReactDOM.createRoot(popupDiv);
      root.render(React.createElement(OrderPopup, { order: order }));  
      const popup = new mapboxgl.Popup({
        offset: 25,
        anchor: 'auto' as any,
        closeButton: false
      }).setDOMContent(popupDiv);
  
      // Adicione um evento para remover o componente quando o popup for fechado
      popup.on('close', () => {
        root.unmount();
        document.body.removeChild(popupDiv);
      });
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(targetMap);
  
      orderMarkers.current.push(marker);
    });
  };
  
  

  /**
   * Atualiza a posição de todos os marcadores de motoboys
   */
  const updateMarkerPositions = () => {
    motoboyMarkers.current
      .filter(m => m.isExpandedMap === isExpandedMap)
      .forEach(markerObj => {
        const motoboy = motoboys.find(m => m.id === markerObj.id);
        if (motoboy) {
          markerObj.marker.setLngLat(motoboy.location);
        }
      });
  };

  /**
   * Centraliza o mapa em uma coordenada específica
   */
  const flyTo = (coordinates: Coordinates, zoom = 15) => {
    if (!map) return;
    
    map.flyTo({
      center: coordinates,
      zoom,
      essential: true
    });
  };

  return {
    motoboyMarkers,
    orderMarkers,
    clearAllMarkers,
    addBaseMarker,
    addMotoboyMarkers,
    addOrderMarkers,
    updateMarkerPositions,
    flyTo
  };
}

export default useMapMarkers;