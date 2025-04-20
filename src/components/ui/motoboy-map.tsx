'use client';

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';

import MotoboyList from './MotoboyList';
import DeliveryDetailsPanel from './DeliveryDetailsPanel';
import ExpandedMapModal from '../modal/ExpandedMapModal';
import { Coordinates, Delivery } from './types';

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
  assigned_driver?: number;
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
  const routes = useRef<string[]>([]);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(false);
  const [showExpandedMap, setShowExpandedMap] = useState<boolean>(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pizzeriaLocation,
      zoom: 13,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (map.current) {
        addPizzeriaMarker(map.current);
        addMotoboyMarkers(map.current);
      }
    });

    map.current.on('move', () => updateMarkerPositions());

    return () => {
      markers.current.forEach(marker => marker.marker.remove());
      markers.current = [];

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [pizzeriaLocation]);

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    markers.current.forEach(marker => marker.marker.remove());
    markers.current = [];

    addMotoboyMarkers(map.current);
  }, [motoboys]);

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
    throw new Error('Function not implemented.');
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
            onHoverPedido={(pedido, index, all) => {
              drawRouteUntil(pedido, index, all); // Essa função será criada depois
            }}
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
