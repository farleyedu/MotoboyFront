import mapboxgl from 'mapbox-gl';
import { Coordinates, Motoboy, Order, MarkerRef, MotoboyComPedidosDTO } from '../../components/ui/types';
import { StatusPedido } from '@/enum/statusPedidoEnum';

export default function createMapMarkers(
  map: mapboxgl.Map | null,
  motoboys: MotoboyComPedidosDTO[],
  orders: Order[],
  styles: Record<string, string>,
  activeMotoboyId: number | null,
  isExpandedMap: boolean,
  setSelectedOrder: (order: Order) => void,
  baseLocation: Coordinates
) {
  const motoboyMarkers: MarkerRef[] = [];
  const orderMarkers: mapboxgl.Marker[] = [];

  const clearAllMarkers = () => {
    motoboyMarkers.forEach(marker => marker.marker.remove());
    motoboyMarkers.length = 0;

    orderMarkers.forEach(marker => marker.remove());
    orderMarkers.length = 0;
  };

  const addBaseMarker = (targetMap: mapboxgl.Map) => {
    if (!targetMap) return;

    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';

    const icon = document.createElement('img');
    icon.src = '/assets/img/store.png';
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

      motoboyMarkers.push({
        id: motoboy.id,
        marker,
        element: el,
        isExpandedMap
      });
    });
  };

  const addOrderMarkers = (targetMap: mapboxgl.Map) => {
    console.log("[addOrderMarkers] Iniciando - total de pedidos:", orders.length, "Mapa:", !!targetMap);

    if (!targetMap || !targetMap.isStyleLoaded()) {
      console.warn("[addOrderMarkers] Mapa ainda não carregado totalmente.");
      return;
    }

    orders.forEach(order => {
      const coords = order.coordinates;
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.tabIndex = -1;
      el.style.outline = 'none';

      const img = document.createElement('img');
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none';
      img.style.outline = 'none';
      img.tabIndex = -1;

      const statusToImageMap: Record<StatusPedido, string> = {
        [StatusPedido.Pendente]: '/assets/img/pinPNG.png',
        [StatusPedido.EmRota]: '/assets/img/pin-em-rota.png',
        [StatusPedido.Concluido]: '/assets/img/pin-concluido.png'
      };

      const statusNumber = Number(order.statusPedido);
      const imgPath = statusToImageMap[statusNumber as StatusPedido] ?? '/img/pin-default.png';

      img.src = imgPath;

      console.log(`[addOrderMarkers] Pedido ${order.id} - img src:`, imgPath);

      el.appendChild(img);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(targetMap);

      marker.getElement().addEventListener('click', () => {
        setSelectedOrder(order);
      });

      orderMarkers.push(marker);
    });
  };

  const flyTo = (coordinates: Coordinates, zoom = 15) => {
    if (!map) return;
    map.flyTo({ center: coordinates, zoom, essential: true });
  };

  const drawRouteUntil = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !map) return;
    map.flyTo({ center: order.coordinates, zoom: 15, essential: true });
  };

  const updateMarkerPositions = (updatedMotoboys: Motoboy[]) => {
    motoboyMarkers
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
