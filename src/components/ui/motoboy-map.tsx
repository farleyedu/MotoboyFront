// src/components/MapaSimples.tsx

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import MotoboyList from './MotoboyList';
import DeliveryDetailsPanel from './DeliveryDetailsPanel';
import ExpandedMapModal from '../modal/ExpandedMapModal';
import { Coordinates, Delivery, Motoboy, Order } from './types';
import OrderPopup from '../../components/ui/OrderPopUp';
import SelectOrdersMode from './SelectOrdersMode';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import useMapMarkers from '../../lib/hooks/useMapMarkers';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN || '';

function useMapResize(mapRef: React.MutableRefObject<mapboxgl.Map | null>, dependencies: any[]) {
  useEffect(() => {
    if (!mapRef.current) return;

    const resizeMap = () => {
      setTimeout(() => mapRef.current?.resize(), 100);
      setTimeout(() => mapRef.current?.resize(), 300);
    };

    resizeMap();

    const mapContainer = mapRef.current.getContainer();
    const resizeObserver = new ResizeObserver(() => resizeMap());

    if (mapContainer) resizeObserver.observe(mapContainer);
    window.addEventListener('resize', resizeMap);

    return () => {
      if (mapContainer) resizeObserver.unobserve(mapContainer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeMap);
    };
  }, dependencies);
}

const MapComponent: React.FC<{
  pizzeriaLocation: Coordinates;
  motoboys: Motoboy[];
  orders: Order[];
  isChatOpen: boolean;
}> = ({ pizzeriaLocation, motoboys, orders, isChatOpen }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const expandedMapContainer = useRef<HTMLDivElement | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const expandedMapRef = useMapInitialization(
    expandedMapContainer,
    pizzeriaLocation,
    showExpandedMap,
    (map) => {
      if (!expandedMapMarkers) return;
      const { addBaseMarker, addMotoboyMarkers, addOrderMarkers } = expandedMapMarkers;
      addBaseMarker();
      addMotoboyMarkers();
      addOrderMarkers(map);
    }
  );
  const expandedMapMarkers = useMapMarkers(
    expandedMapRef.current,
    motoboys,
    orders,
    styles,
    activeMotoboyId,
    true,
    setSelectedOrder,
    pizzeriaLocation
  );
  // const locateMotoboy = (motoboyId: number, isExpanded = false) => {
  //   const motoboy = motoboys.find(m => m.id === motoboyId);
  //   if (!motoboy) return;
  //   (isExpanded ? expandedMapMarkers?.flyTo?.(motoboy.location) : mainMapMarkers?.flyTo?.(motoboy.location));
  // };
  // const mainMapMarkers = useMapMarkers(
  //   mapRef.current,
  //   motoboys,
  //   orders,
  //   styles,
  //   activeMotoboyId,
  //   false,
  //   setSelectedOrder,
  //   pizzeriaLocation
  // );
  // const showMotoboyDetails = (motoboyId: number) => {
  //   const motoboy = motoboys.find(m => m.id === motoboyId);
  //   if (!motoboy || !mapRef.current) return;
  //   setActiveMotoboyId(motoboyId);
  //   setSelectedMotoboy(motoboy);
  //   setShowDetailsPanel(true);
  //   mainMapMarkers?.flyTo?.(motoboy.location, 14);
  // };


  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-48.2772, -18.9146], // Centro de Uberlândia
      zoom: 13,
    });

    map.on('load', () => {
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.position = 'absolute'; // RELATIVE! Igual seu SelectOrdersMode
      el.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = '/assets/img/pinPNG.png'; // Pode trocar o caminho da imagem depois
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none';

      el.appendChild(img);

      new mapboxgl.Marker({ element: el })
        .setLngLat([-48.2772, -18.9146]) // Mesmo ponto de Uberlândia
        .addTo(map);
    });

    return () => map.remove();
  }, []);



  return (
    <div className={styles.mapComponentContainer} ref={mapContainerRef}>
      {<div className={styles.map}>
        {!isSelectingRoute && (
          <>
            <button
              className={styles.expandButtonFloating}
              onClick={() => setShowExpandedMap(true)}
              aria-label="Expandir Mapa"
            >
              <i className="fas fa-expand" />
            </button>
            <button
              onClick={() => setIsSelectingRoute(true)}
              aria-label="Selecionar Rota"
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '16px',
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              ➕ Selecionar Rota
            </button>
          </>
        )}
        {isSelectingRoute ? (
          <SelectOrdersMode
            orders={orders.filter(order => order.status === 'pendente')}
            motoboys={motoboys}
            onConfirm={(selectedOrders, selectedMotoboy) => {
              console.log('Confirmando pedidos:', selectedOrders, 'para motoboy:', selectedMotoboy);
              setIsSelectingRoute(false);
            }}
            onCancel={() => setIsSelectingRoute(false)}
            isChatOpen={isChatOpen}
          />
        ) : (
          <>
            <div
              ref={mapContainer}
              className={styles.mapInner}
              data-chat-open={isChatOpen ? 'true' : 'false'}
            />
            {/* <div className={styles.floatingMotoboyList}>
              <MotoboyList
                motoboys={motoboys}
                activeMotoboy={activeMotoboyId}
                onLocateMotoboy={locateMotoboy}
                onShowDetails={showMotoboyDetails}
                onHoverPedido={drawRouteUntil}
              />
            </div> */}
          </>
        )}
      </div> }
    </div>
  );
}
export default MapComponent;
