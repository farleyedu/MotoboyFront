import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import MotoboyList from './MotoboyList';
import { Coordinates, MotoboyComPedidosDTO, Order } from './types';
import OrderPopup from '../../components/ui/OrderPopUp';
import SelectOrdersMode from './SelectOrdersMode';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import { useFetchMotoboys } from '../../lib/hooks/useFetchMotoboy';
import { StatusPedido } from '../../enum/statusPedidoEnum';
import createMapMarkers from '../../lib/hooks/useMapMarkers';

mapboxgl.accessToken = "pk.eyJ1IjoiZmFybGV5ZWR1IiwiYSI6ImNtOWJ1ZzJhMDBra28ybG9leHZ5MWtvemIifQ.15QMU1QLHSLkCO7zPlUeYg";

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
  const mainMapMarkersRef = useRef<any>(null);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [, setShowExpandedMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  console.log("[MapComponent] Orders recebidos:", orders);
  console.log("[MapComponent] Motoboys:", motoboys);

  const handleMapLoaded = useCallback((map: mapboxgl.Map) => {
    const checkReady = () => {
      if (map.isStyleLoaded()) {
        console.log("[MapComponent] Estilo do mapa OK ✅. Criando e adicionando marcadores...");
  
        const markers = createMapMarkers(
          map,
          motoboys,
          orders,
          styles,
          activeMotoboyId,
          false,
          setSelectedOrder,
          pizzeriaLocation
        );
  
        mainMapMarkersRef.current = markers;
        markers.addBaseMarker(map);
        markers.addOrderMarkers(map);
        markers.addMotoboyMarkers(map);
      } else {
        console.log("[MapComponent] Estilo ainda não pronto, tentando novamente em 200ms...");
        setTimeout(checkReady, 200);
      }
    };
  
    checkReady();
  }, []); // <-- IMPORTANTE: não coloque dependências
  
  

  const mapRef = useMapInitialization(mapContainerRef, pizzeriaLocation, true, handleMapLoaded);

  useEffect(() => {
    if (!isLoading && mainMapMarkersRef.current) {
      mainMapMarkersRef.current.updateMarkerPositions(motoboys);
    }
  }, [motoboys]);

  const locateMotoboy = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;
    mainMapMarkersRef.current?.flyTo?.(motoboy.location);
  };

  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !mapInstanceRef.current) return;
    setActiveMotoboyId(motoboyId);
    mainMapMarkersRef.current?.flyTo?.(motoboy.location, 14);
  };

  const drawRouteUntil = (orderId: number) => {
    mainMapMarkersRef.current?.drawRouteUntil?.(orderId);
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

  if (isLoading) return null;

  return (
    <div className={styles.mapComponentContainer} ref={mapContainerRef}>
      <div className={styles.map}>
        {!isSelectingRoute && (
          <>
            <button className={styles.expandButtonFloating} onClick={() => {}}>
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
