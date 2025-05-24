import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import MotoboyList from './MotoboyList';
import { Coordinates, MotoboyComPedidosDTO, Order } from './types';
import OrderPopup from '../../components/ui/OrderPopUp';
import SelectOrdersMode from './SelectOrdersMode';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import useMapMarkers from '../../lib/hooks/useMapMarkers';
import { useFetchMotoboys } from '../../lib/hooks/useFetchMotoboy';
import { StatusPedido } from '../../enum/statusPedidoEnum';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN || '';

const MapComponent: React.FC<{
  pizzeriaLocation: Coordinates;
  orders: Order[];
  isChatOpen: boolean;
}> = ({ pizzeriaLocation, orders, isChatOpen }) => {
  const isLoading = !orders || orders.length === 0;
  const fetchedMotoboys = useFetchMotoboys();
  const motoboys: MotoboyComPedidosDTO[] = fetchedMotoboys.map((m) => ({
    ...m,
    location: [m.longitude, m.latitude] as Coordinates
  }));

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
const [, setShowExpandedMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

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

  const handleMapLoaded = useCallback((map: mapboxgl.Map) => {
    if (mainMapMarkers) {
      mainMapMarkers.addOrderMarkers(map);
      mainMapMarkers.addBaseMarker(map);
    }
  }, [mainMapMarkers]);

  const mapRef = useMapInitialization(mapContainerRef, pizzeriaLocation, true, handleMapLoaded);

  const locateMotoboy = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;
    mainMapMarkers?.flyTo?.(motoboy.location);
  };

  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !mapInstanceRef.current) return;
    setActiveMotoboyId(motoboyId);
    mainMapMarkers?.flyTo?.(motoboy.location, 14);
  };

  const drawRouteUntil = (orderId: number) => {
    mainMapMarkers?.drawRouteUntil?.(orderId);
  };

  const handleCancelSelectOrdersMode = () => {
    setIsSelectingRoute(false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (mapRef && mapRef.current) {
      setMapInstance(mapRef.current);
    }
  }, [mapRef, isLoading]);

  useEffect(() => {
    if (!isLoading && mapInstance) {
      setTimeout(() => {
        mapInstance.resize();
      }, 350);
    }
  }, [isChatOpen, isSelectingRoute, mapInstance, isLoading]);

  useEffect(() => {
    if (!isLoading && mapRef.current) {
      mainMapMarkers.addMotoboyMarkers(mapRef.current);
    }
  }, [motoboys, mainMapMarkers, mapRef, isLoading]);

  if (isLoading) return null;

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
