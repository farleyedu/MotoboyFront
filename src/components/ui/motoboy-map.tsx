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

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const mapRef = useMapInitialization(
    mapContainer,
    pizzeriaLocation,
    !isSelectingRoute,
    (map) => {
      if (!mainMapMarkers) return;
      const { addBaseMarker, addMotoboyMarkers, addOrderMarkers, updateMarkerPositions } = mainMapMarkers;
      addBaseMarker();
      addMotoboyMarkers();
      addOrderMarkers(map);
      map.on('move', updateMarkerPositions);
    }
  );

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

  const mainMapMarkers = useMapMarkers(
    mapRef.current,
    motoboys,
    orders,
    styles,
    activeMotoboyId,
    false,
    setSelectedOrder,
    pizzeriaLocation
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

  useMapResize(mapRef, [isChatOpen, isSelectingRoute]);
  useMapResize(expandedMapRef, [showExpandedMap]);

  const locateMotoboy = (motoboyId: number, isExpanded = false) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;
    (isExpanded ? expandedMapMarkers?.flyTo?.(motoboy.location) : mainMapMarkers?.flyTo?.(motoboy.location));
  };

  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !mapRef.current) return;
    setActiveMotoboyId(motoboyId);
    setSelectedMotoboy(motoboy);
    setShowDetailsPanel(true);
    mainMapMarkers?.flyTo?.(motoboy.location, 14);
  };

  const assignOrderToMotoboy = (motoboyId: number, orderId: number) => {
    console.log(`Atribuindo pedido ${orderId} ao motoboy ${motoboyId}`);
  };

  const drawRouteUntil = (pedido: Delivery, index: number, all: Delivery[]) => {
    console.log('Highlight rota até pedido', pedido.id);
  };

  return (
    <div className={styles.mapComponentContainer} data-chat-open={isChatOpen ? 'true' : 'false'}>
      <div className={styles.map}>
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
            <div className={styles.floatingMotoboyList}>
              <MotoboyList
                motoboys={motoboys}
                activeMotoboy={activeMotoboyId}
                onLocateMotoboy={locateMotoboy}
                onShowDetails={showMotoboyDetails}
                onHoverPedido={drawRouteUntil}
              />
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <div className={styles.orderPopupContainer}>
          <OrderPopup order={selectedOrder} />
        </div>
      )}

      {showDetailsPanel && selectedMotoboy && (
        <DeliveryDetailsPanel
          motoboy={selectedMotoboy}
          pendingOrders={orders.filter(o => !o.assigned_driver)}
          onClose={() => {
            setShowDetailsPanel(false);
            setActiveMotoboyId(null);
          }}
          onAssignOrder={assignOrderToMotoboy}
        />
      )}

      {showExpandedMap && (
        <ExpandedMapModal
          mapContainerRef={expandedMapContainer}
          motoboys={motoboys}
          onClose={() => setShowExpandedMap(false)}
          onLocateMotoboy={(id) => locateMotoboy(id, true)}
          onShowDetails={showMotoboyDetails}
        />
      )}
    </div>
  );
};

export default MapComponent;
