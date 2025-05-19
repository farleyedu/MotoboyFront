import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates, Motoboy, Order, MarkerRef, MotoboyComPedidosDTO } from '../../components/ui/types';

export default function useMapMarkers(
  map: mapboxgl.Map | null,
  motoboys: MotoboyComPedidosDTO[],
  orders: Order[],
  styles: Record<string, string>,
  activeMotoboyId: number | null,
  isExpandedMap: boolean,
  setSelectedOrder: (order: Order) => void, // ✅ Aqui trocado
  baseLocation: Coordinates
) {
  const motoboyMarkers = useRef<MarkerRef[]>([]);
  const orderMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    return () => {
      clearAllMarkers();
    };
  }, []);

  const clearAllMarkers = () => {
    motoboyMarkers.current.forEach(marker => marker.marker.remove());
    motoboyMarkers.current = [];

    orderMarkers.current.forEach(marker => marker.remove());
    orderMarkers.current = [];
  };

  const addBaseMarker = (targetMap: mapboxgl.Map) => {
    if (!targetMap) return;
  
    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    
    const icon = document.createElement('img');
    icon.src = '/assets/img/store.png'; // ícone da loja
    icon.style.width = '36px';
    icon.style.height = '36px';
    icon.style.objectFit = 'contain';
    
    const label = document.createElement('span');
    label.innerText = 'Store';
    label.style.marginTop = '2px';
    label.style.fontSize = '12px';
    label.style.color = '#333';
    label.style.fontWeight = 'bold';
    
    el.appendChild(icon);
    el.appendChild(label);
    
    new mapboxgl.Marker(el)
      .setLngLat(baseLocation)
      .addTo(targetMap);
  };

  const addMotoboyMarkers = (targetMap: mapboxgl.Map) => {
    if (!targetMap) return;
    motoboys.forEach(motoboy => {
      if (motoboy.status === "offline") return;
  
      if (!Array.isArray(motoboy.location) || motoboy.location.length !== 2) {
        console.warn("Motoboy com location inválido:", motoboy);
        return;
      }
  
      const el = document.createElement('div');
      el.className = styles.motoboyMarker;
      el.innerHTML = motoboy.nome.charAt(0);
  
      if (motoboy.id === activeMotoboyId) {
        el.classList.add(styles.activeMotoboy);
      }
  
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="${styles.markerPopup}">
          <h3>${motoboy.nome}</h3>
          <p>${motoboy.pedidos.length} entregas em andamento</p>
        </div>
      `);
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat(motoboy.location)
        .setPopup(popup)
        .addTo(targetMap);
  
      motoboyMarkers.current.push({
        id: motoboy.id,
        marker,
        element: el,
        isExpandedMap
      });
    });
  };

  const addOrderMarkers = (targetMap: mapboxgl.Map) => {
    orders.forEach(order => {
      const coords = order.coordinates;
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
  
      const img = document.createElement('img');
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none';
  
      // 🔽 Aqui o switch por status
      switch (order.status) {
        case 'pendente':
          img.src = '/assets/img/pinPNG.png';
          break;
        case 'em_rota':
          img.src = '/assets/img/pin-em-rota.png';
          break;
        case 'concluido':
          img.src = '/assets/img/pin-concluido.png';
          break;
        default:
          img.src = '/assets/img/pin-default.png';
      }
  
      el.appendChild(img);
  
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(targetMap);
  
      marker.getElement().addEventListener('click', () => {
        setSelectedOrder(order);
      });
  
      orderMarkers.current.push(marker);
    });
  };

  const flyTo = (coordinates: Coordinates, zoom = 15) => {
    if (!map) return;
    map.flyTo({ center: coordinates, zoom, essential: true });
  };

  const drawRouteUntil = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !map) return;

    // Lógica para desenhar a rota até o pedido
    map.flyTo({ center: order.coordinates, zoom: 15, essential: true });
  };

  // 🔁 NOVO: Atualização externa da localização dos motoboys
const updateMarkerPositions = (updatedMotoboys: Motoboy[]) => {
  motoboyMarkers.current
    .filter(m => m.isExpandedMap === isExpandedMap)
    .forEach(markerObj => {
      const updated = updatedMotoboys.find(m => m.id === markerObj.id);
      if (updated) {
        markerObj.marker.setLngLat(updated.location);
      }
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
    flyTo,
    drawRouteUntil
  };
}
