import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import MotoboyList from './MotoboyList';
import DeliveryDetailsPanel from './DeliveryDetailsPanel';
import ExpandedMapModal from '../modal/ExpandedMapModal';
import { Coordinates, Delivery, Motoboy, MotoboyComPedidosDTO, Order } from './types';
import OrderPopup from '../../components/ui/OrderPopUp';
import SelectOrdersMode from './SelectOrdersMode';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import useMapMarkers from '../../lib/hooks/useMapMarkers';
import { useFetchMotoboys } from '../../lib/hooks/useFetchMotoboy';
import { StatusPedido } from '../../enum/statusPedidoEnum';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN || '';

function useMapResize(containerRef: React.RefObject<HTMLDivElement | null>, mapRef: React.MutableRefObject<mapboxgl.Map | null>) {
  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;

    const resizeMap = () => {
      mapRef.current?.resize();
    };

    const resizeObserver = new ResizeObserver(() => resizeMap());
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef, mapRef]);
}

const MapComponent: React.FC<{
  pizzeriaLocation: Coordinates;
  orders: Order[];
  isChatOpen: boolean;
}> = ({ pizzeriaLocation, orders, isChatOpen }) => {
console.log("valor de orders passado pelo page: ", orders)
const isLoading = !orders || orders.length === 0;
if (isLoading) return null;

  const fetchedMotoboys = useFetchMotoboys();
  const motoboys: MotoboyComPedidosDTO[] = fetchedMotoboys.map((m) => ({
    ...m,
    location: [m.longitude, m.latitude] as Coordinates
  }));

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<MotoboyComPedidosDTO | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useMapResize(mapContainerRef, mapInstanceRef);

  const expandedMapContainer = useRef<HTMLDivElement | null>(null);

  const expandedMapRef = useMapInitialization(
    expandedMapContainer,
    pizzeriaLocation,
    showExpandedMap,
    (map) => {
      if (!expandedMapMarkers) return;
      const { addBaseMarker, addMotoboyMarkers, addOrderMarkers } = expandedMapMarkers;
      addBaseMarker(map);
      addMotoboyMarkers(map);
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

  const mainMapMarkers = useMapMarkers(
    mapInstanceRef.current,
    motoboys,
    orders,
    styles,
    activeMotoboyId,
    false,
    setSelectedOrder,
    pizzeriaLocation
  );

  const locateMotoboy = (motoboyId: number, isExpanded = false) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;
    (isExpanded ? expandedMapMarkers?.flyTo?.(motoboy.location) : mainMapMarkers?.flyTo?.(motoboy.location));
  };

  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !mapInstanceRef.current) return;
    setActiveMotoboyId(motoboyId);
    setSelectedMotoboy(motoboy);
    setShowDetailsPanel(true);
    mainMapMarkers?.flyTo?.(motoboy.location, 14);
  };

  const drawRouteUntil = (orderId: number) => {
    mainMapMarkers?.drawRouteUntil?.(orderId);
  };

  const handleCancelSelectOrdersMode = () => {
    setIsSelectingRoute(false);
  };

  const handleMapLoaded = (map: mapboxgl.Map) => {
    mainMapMarkers.addOrderMarkers(map);
    mainMapMarkers.addBaseMarker(map);
  };

  const mapRef = useMapInitialization(mapContainerRef, pizzeriaLocation, true, handleMapLoaded);

  useEffect(() => {
    if (mapRef && mapRef.current) {
      setMapInstance(mapRef.current);
    }
  }, [mapRef]);

  useEffect(() => {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.resize();
      }, 350);
    }
  }, [isChatOpen, isSelectingRoute]);

  useEffect(() => {
    if (mapRef.current) {
      mainMapMarkers.addMotoboyMarkers(mapRef.current);
    }
  }, [mapRef.current, motoboys]);

  console.log("order passando pra dentro do seletor", orders);

  return (
    <div className={styles.mapComponentContainer} ref={mapContainerRef}>
      <div className={styles.map}>
        {!isSelectingRoute && (
          <>
            <button className={styles.expandButtonFloating} onClick={() => setShowExpandedMap(true)}>
              <i className="fas fa-expand" />
            </button>

            <button
              onClick={() => setIsSelectingRoute(true)}
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
                zIndex: 1000,
              }}
            >
              ➕ Selecionar Rota
            </button>
          </>
        )}

        {!isSelectingRoute && (
          <div className={styles.floatingMotoboyList}>
            <MotoboyList
              motoboys={motoboys}
              activeMotoboy={activeMotoboyId}
              onLocateMotoboy={locateMotoboy}
              onShowDetails={showMotoboyDetails}
              onHoverPedido={(pedido) => drawRouteUntil(pedido.id)}
            />
          </div>
        )}

        {isSelectingRoute && (
          <div className={styles.selectOrdersOverlay}>
            <SelectOrdersMode
              orders={orders.filter(order => Number(order.statusPedido) === StatusPedido.Pendente)}
              motoboys={motoboys}
              onConfirm={() => setIsSelectingRoute(false)}
              onCancel={handleCancelSelectOrdersMode}
              isChatOpen={isChatOpen}
            />
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className={styles.orderPopup}>
          <OrderPopup
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
