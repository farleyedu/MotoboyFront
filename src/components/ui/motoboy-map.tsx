// src/components/MapaSimples.tsx

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
  motoboys: MotoboyComPedidosDTO[];
  orders: Order[];
  isChatOpen: boolean;
}> = ({ pizzeriaLocation, motoboys, orders, isChatOpen }) => {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showExpandedMap, setShowExpandedMap] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
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
    mainMapMarkers.addBaseMarker(map); // opcional: marca pizzaria
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
      console.log('Mapa inicializado, chamando addMotoboyMarkers...');
      mainMapMarkers.addMotoboyMarkers(mapRef.current); // Chame a função aqui
    }
    console.log('deu errado, no if do mapInstanceRef.current', mapRef.current);
  }, [mapRef.current, motoboys]); // Dependências do mapa e motoboys




  // 🔁 INÍCIO: SIMULAÇÃO DE MOVIMENTO SUAVE DO MOTOBOY (TESTE TEMPORÁRIO)
  const simulateMotoboyMovement = () => {
    const route: Coordinates[] = [
      [-48.2542817, -18.8969507], [-48.25479134, -18.89754230], [-48.25530098, -18.89813390],
      [-48.25581063, -18.89872551], [-48.25632027, -18.89931711], [-48.25682991, -18.89990871],
      [-48.25733955, -18.90050031], [-48.25784919, -18.90109191], [-48.25835883, -18.90168351],
      [-48.25886847, -18.90227511], [-48.25937811, -18.90286671], [-48.25988775, -18.90345831],
      [-48.26039739, -18.90404991], [-48.26090703, -18.90464151], [-48.26141667, -18.90523311],
      [-48.26192631, -18.90582471], [-48.26243595, -18.90641631], [-48.26294559, -18.90700791],
      [-48.26345523, -18.90759951], [-48.26396487, -18.90819111], [-48.26447451, -18.90878271],
      [-48.26498415, -18.90937431], [-48.26549379, -18.90996591], [-48.26600343, -18.91055751],
      [-48.26651307, -18.91114911], [-48.26702271, -18.91174071], [-48.26753235, -18.91233231],
      [-48.26804199, -18.91292391], [-48.26855163, -18.91351551], [-48.26906127, -18.91410711],
      [-48.26957091, -18.91469871], [-48.27008055, -18.91529031], [-48.27059019, -18.91588191],
      [-48.27109983, -18.91647351], [-48.27160947, -18.91706511], [-48.27211911, -18.91765671],
      [-48.27262875, -18.91824831], [-48.27313839, -18.91883991], [-48.27364803, -18.91943151],
      [-48.27415767, -18.92002311], [-48.27466731, -18.92061471], [-48.27517695, -18.92120631],
      [-48.27568659, -18.92179791], [-48.27619623, -18.92238951], [-48.27670587, -18.92298111],
      [-48.27721551, -18.92357271], [-48.27772515, -18.92416431], [-48.27823479, -18.92475591],
      [-48.27874443, -18.92534751], [-48.27925407, -18.92593911], [-48.27976371, -18.92653071],
      [-48.28027335, -18.92712231], [-48.28078299, -18.92771391], [-48.28129263, -18.92830551],
      [-48.28180227, -18.92889711], [-48.28231191, -18.92948871], [-48.28282155, -18.93008031],
      [-48.28333119, -18.93067191], [-48.28384083, -18.93126351], [-48.28435047, -18.93185511],
      [-48.28486011, -18.93244671], [-48.28536975, -18.93303831], [-48.28587939, -18.93362991],
      [-48.28638903, -18.93422151], [-48.28689867, -18.93481311], [-48.28740831, -18.93540471],
      [-48.28791795, -18.93599631], [-48.28842759, -18.93658791], [-48.28893723, -18.93717951],
      [-48.28944687, -18.93777111], [-48.28995651, -18.93836271], [-48.29046615, -18.93895431],
      [-48.29097579, -18.93954591], [-48.29148543, -18.94013751], [-48.29199507, -18.94072911],
      [-48.29250471, -18.94132071], [-48.29301435, -18.94191231], [-48.29352399, -18.94250391],
      [-48.29403363, -18.94309551], [-48.29454327, -18.94368711], [-48.29505291, -18.94427871],
      [-48.29556255, -18.94487031], [-48.29607219, -18.94546191], [-48.29658183, -18.94605351],
      [-48.29709147, -18.94664511], [-48.29760111, -18.94723671], [-48.29811075, -18.94782831],
      [-48.29862039, -18.94841991], [-48.29913003, -18.94901151], [-48.29963967, -18.94960311],
      [-48.30014931, -18.95019471], [-48.30065895, -18.95078631], [-48.30116859, -18.95137791],
      [-48.30167823, -18.95196951], [-48.30218787, -18.95256111], [-48.30269751, -18.95315271],
      [-48.30320715, -18.95374431], [-48.30371679, -18.95433591], [-48.30422643, -18.95492751],
      [-48.3047363, -18.9555193]
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index >= route.length) {
        clearInterval(interval);
        return;
      }

      const newLocation: Coordinates = route[index];
      const updatedMotoboys = motoboys.map((mb) =>
        mb.id === 1 ? { ...mb, location: newLocation } : mb
      );

      mainMapMarkers.updateMarkerPositions(updatedMotoboys); // Precisa estar implementado no useMapMarkers
      index++;
    }, 200); // movimento suave a cada 200ms
  };
  // 🔁 FIM: SIMULAÇÃO DE MOVIMENTO SUAVE DO MOTOBOY (TESTE TEMPORÁRIO)




  return (
    <div className={styles.mapComponentContainer} ref={mapContainerRef}>
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
                zIndex: 1000,
              }}
            >
              ➕ Selecionar Rota
            </button>


            <button
              onClick={simulateMotoboyMovement}
              aria-label="Simular Movimento"
              style={{
                position: 'absolute',
                bottom: '160px',
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
              🚀 Simular Motoboy
            </button>
          </>
        )}

        {/* <div
          ref={mapContainer}
          className={styles.mapInner}
          data-chat-open={isChatOpen ? 'true' : 'false'}
        /> */}

        {!isSelectingRoute && (
          <div className={styles.floatingMotoboyList}>
            <MotoboyList
              motoboys={motoboys}
              activeMotoboy={activeMotoboyId}
              onLocateMotoboy={locateMotoboy}
              onShowDetails={showMotoboyDetails}
              onHoverPedido={(pedido, index, all) => drawRouteUntil(pedido.id)}
            />
          </div>
        )}

        {isSelectingRoute && (
          <div className={styles.selectOrdersOverlay}>
            <SelectOrdersMode
              orders={orders.filter(order => order.status === 'pendente')}
              motoboys={motoboys}
              onConfirm={(selectedOrders, selectedMotoboy) => {
                setIsSelectingRoute(false);
              }}
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
