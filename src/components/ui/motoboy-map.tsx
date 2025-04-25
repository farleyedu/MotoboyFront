'use client';

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import ReactDOM from 'react-dom/client';
import MotoboyList from './MotoboyList';
import DeliveryDetailsPanel from './DeliveryDetailsPanel';
import ExpandedMapModal from '../modal/ExpandedMapModal';
import { Coordinates, Delivery } from './types';
import OrderPopup from './OrderPopUp';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN || '';

export type MotoboyStatus = 'online' | 'offline' | 'delivering';

interface Motoboy {
  id: number;
  name: string;
  avatar?: string;
  phone?: string;
  vehicle?: string;
  status: MotoboyStatus;
  location: Coordinates;
  deliveries: Delivery[];
}

interface Order {
  id: number;
  address?: string;
  items: string | string[];
  value?: string;
  region?: string;
  status?: string;
  assigned_driver?: number;
  coordinates: Coordinates; // importante para marcar no mapa
}

interface MarkerRef {
  id: number;
  marker: mapboxgl.Marker;
  element: HTMLDivElement;
  isExpandedMap: boolean;
}

interface MapComponentProps {
  pizzeriaLocation: Coordinates;
  motoboys: Motoboy[];
  orders: Order[];
}




const MapComponent: React.FC<MapComponentProps> = ({ pizzeriaLocation, motoboys, orders }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const expandedMapContainer = useRef<HTMLDivElement | null>(null);
  const expandedMap = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<MarkerRef[]>([]);
  const orderMarkers = useRef<mapboxgl.Marker[]>([]);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(false);
  const [showExpandedMap, setShowExpandedMap] = useState<boolean>(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pizzeriaLocation,
      zoom: 13,
      attributionControl: false,
    });

    map.current = m;

    m.addControl(new mapboxgl.NavigationControl(), 'top-right');

    m.on('load', () => {
      addPizzeriaMarker(m);
      addMotoboyMarkers(m);
      addOrderMarkers(m);
    });

    m.on('move', () => updateMarkerPositions());

    return () => {
      markers.current.forEach(marker => marker.marker.remove());
      markers.current = [];

      orderMarkers.current.forEach(marker => marker.remove());
      orderMarkers.current = [];

      map.current?.remove();
      map.current = null;
    };
  }, [pizzeriaLocation]);

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    markers.current.forEach(marker => marker.marker.remove());
    markers.current = [];
    addMotoboyMarkers(map.current);

    orderMarkers.current.forEach(marker => marker.remove());
    orderMarkers.current = [];
    addOrderMarkers(map.current);
  }, [motoboys, orders]);

  const addPizzeriaMarker = (targetMap: mapboxgl.Map) => {
    new mapboxgl.Marker({ color: '#e74c3c', scale: 1.2 })
      .setLngLat(pizzeriaLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Pizzaria</h3><p>Sede</p>'))
      .addTo(targetMap);
  };

  const addMotoboyMarkers = (targetMap: mapboxgl.Map, isExpandedMap = false) => {
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
        .addTo(targetMap);

      markers.current.push({ id: motoboy.id, marker, element: el, isExpandedMap });
    });
  };

  const addOrderMarkers = (targetMap: mapboxgl.Map) => {
    orders.forEach(order => {
      const coords = order.coordinates;
  
      const el = document.createElement('div');
      switch (order.status) {
        case 'concluida':
          el.className = styles.orderMarkerConcluida;
          break;
        case 'em_rota':
          el.className = styles.orderMarkerEmRota;
          break;
        case 'pendente':
        default:
          el.className = styles.orderMarkerPendente;
          break;
      }
  
      // Cria container para React
      const popupDiv = document.createElement('div');
      const root = ReactDOM.createRoot(popupDiv);
      root.render(<OrderPopup order={order} />);
  
      const popup = new mapboxgl.Popup({
        offset: 25,
        anchor: 'auto' as any, // permite auto posicionamento inteligente
        closeButton: false 
      }).setDOMContent(popupDiv);
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(targetMap);
  
      // Centraliza visualmente com deslocamento para cima (sem afetar lógica do anchor)
      targetMap.easeTo({
        center: coords,
        offset: [0, -50], // desloca visualmente o centro 50px pra cima
        zoom: 15,
        essential: true
      });
  
      orderMarkers.current.push(marker);
    });
  };

  const updateMarkerPositions = (isExpandedMap = false) => {
    markers.current
      .filter(m => m.isExpandedMap === isExpandedMap)
      .forEach(markerObj => {
        const motoboy = motoboys.find(m => m.id === markerObj.id);
        if (motoboy) {
          markerObj.marker.setLngLat(motoboy.location);
        }
      });
  };

  const locateMotoboy = (motoboyId: number, isExpandedMap = false) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;

    const targetMap = isExpandedMap ? expandedMap.current : map.current;
    if (!targetMap) return;

    targetMap.flyTo({ center: motoboy.location, zoom: 15, essential: true });
  };

  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !map.current) return;

    setActiveMotoboyId(motoboyId);
    setSelectedMotoboy(motoboy);
    setShowDetailsPanel(true);

    map.current.flyTo({ center: motoboy.location, zoom: 14, essential: true });
  };

  const closeDetailsPanel = () => {
    setShowDetailsPanel(false);
    setActiveMotoboyId(null);
  };

  const expandMap = () => setShowExpandedMap(true);
  const closeExpandedMap = () => setShowExpandedMap(false);

  const assignOrderToMotoboy = (motoboyId: number, orderId: number) => {
    console.log(`Atribuindo pedido ${orderId} ao motoboy ${motoboyId}`);
  };

  function drawRouteUntil(pedido: Delivery, index: number, all: Delivery[]) {
    console.log('Highlight rota até pedido', pedido.id);
  }

  
  return (
    <div className={styles.mapComponentContainer}>
      <div className={styles.map}>
        <button
          className={styles.expandButtonFloating}
          onClick={expandMap}
          aria-label="Expandir Mapa"
        >
          <i className="fas fa-expand" />
        </button>
        <div ref={mapContainer} className={styles.mapInner} />
        <div className={styles.floatingMotoboyList}>
          <MotoboyList
            motoboys={motoboys}
            activeMotoboy={activeMotoboyId}
            onLocateMotoboy={locateMotoboy}
            onShowDetails={showMotoboyDetails}
            onHoverPedido={(pedido, index, all) => drawRouteUntil(pedido, index, all)}
          />
        </div>
      </div>

      {showDetailsPanel && selectedMotoboy && (
        <DeliveryDetailsPanel
          motoboy={selectedMotoboy}
          pendingOrders={orders.filter(o => !o.assigned_driver)}
          onClose={closeDetailsPanel}
          onAssignOrder={assignOrderToMotoboy}
        />
      )}

      {showExpandedMap && (
        <ExpandedMapModal
          mapContainerRef={expandedMapContainer}
          motoboys={motoboys}
          onClose={closeExpandedMap}
          onLocateMotoboy={(id) => locateMotoboy(id, true)}
          onShowDetails={showMotoboyDetails}
        />
      )}
    </div>
  );
};

export default MapComponent;
