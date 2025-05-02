import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates, Motoboy, Order, MarkerRef } from '../../components/ui/types';

export default function useMapMarkers(
  map: mapboxgl.Map | null,
  motoboys: Motoboy[],
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

  const addBaseMarker = () => {
    if (!map) return;

    new mapboxgl.Marker({ color: '#e74c3c', scale: 1.2 })
      .setLngLat(baseLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Pizzaria</h3><p>Sede</p>'))
      .addTo(map);
  };

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
      img.src = '/assets/img/pinPNG.png';

      el.appendChild(img);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(targetMap);

      marker.getElement().addEventListener('click', () => {
        setSelectedOrder(order); // ✅ Atualiza o pedido clicado
      });

      orderMarkers.current.push(marker);
    });
  };

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

  const flyTo = (coordinates: Coordinates, zoom = 15) => {
    if (!map) return;
    map.flyTo({ center: coordinates, zoom, essential: true });
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
