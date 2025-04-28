import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../../style/MapComponent.module.css';
import ReactDOM from 'react-dom/client';
import MotoboyList from './MotoboyList';
import DeliveryDetailsPanel from './DeliveryDetailsPanel';
import ExpandedMapModal from '../modal/ExpandedMapModal';
import { Coordinates, Delivery, Motoboy, Order, MarkerRef } from './types';
import OrderPopup from './OrderPopUp';
import SelectOrdersMode from './SelectOrdersMode';
import useMapInitialization from '../../lib/hooks/useMapInitialization';
import useMapMarkers from '../../lib/hooks/useMapMarkers';

// Definindo o token de acesso para o Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN || '';

/**
 * Componente principal do mapa de motoboys
 */
const MapComponent: React.FC<{
  pizzeriaLocation: Coordinates;
  motoboys: Motoboy[];
  orders: Order[];
  isChatOpen: boolean;
}> = ({ pizzeriaLocation, motoboys, orders, isChatOpen }) => {
  // Refs para os contêineres dos mapas
  const mapContainer = useRef<HTMLDivElement>(null);
  const expandedMapContainer = useRef<HTMLDivElement | null>(null);

  // Estados do componente
  const [activeMotoboyId, setActiveMotoboyId] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(false);
  const [showExpandedMap, setShowExpandedMap] = useState<boolean>(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);

  // Callback para quando o mapa principal é carregado
  const handleMainMapLoaded = (map: mapboxgl.Map) => {
    const { addBaseMarker, addMotoboyMarkers, addOrderMarkers } = mainMapMarkers;
    addBaseMarker();
    addMotoboyMarkers();
    addOrderMarkers();
    
    // Adiciona listener para atualizar posições dos marcadores ao mover o mapa
    map.on('move', () => mainMapMarkers.updateMarkerPositions());
  };

  // Callback para quando o mapa expandido é carregado
  const handleExpandedMapLoaded = (map: mapboxgl.Map) => {
    const { addBaseMarker, addMotoboyMarkers, addOrderMarkers } = expandedMapMarkers;
    addBaseMarker();
    addMotoboyMarkers();
    addOrderMarkers();
  };

  // Inicialização dos mapas usando o hook personalizado
  const mapRef = useMapInitialization(
    mapContainer,
    pizzeriaLocation,
    !isSelectingRoute,
    handleMainMapLoaded
  );

  const expandedMapRef = useMapInitialization(
    expandedMapContainer,
    pizzeriaLocation,
    showExpandedMap,
    handleExpandedMapLoaded
  );

  // Inicialização dos marcadores usando o hook personalizado
  const mainMapMarkers = useMapMarkers(
    mapRef.current,
    motoboys,
    orders,
    styles,
    activeMotoboyId,
    false,
    OrderPopup,
    pizzeriaLocation
  );

  const expandedMapMarkers = useMapMarkers(
    expandedMapRef.current,
    motoboys,
    orders,
    styles,
    activeMotoboyId,
    true,
    OrderPopup,
    pizzeriaLocation
  );

  // Efeito para redimensionar o mapa quando o chat é aberto/fechado
  useEffect(() => {
    if (mapRef.current && !isSelectingRoute) {
      requestAnimationFrame(() => {
        mapRef.current?.resize();
      });
    }
  }, [isChatOpen, isSelectingRoute]);

  // Handlers para as ações de seleção de rota
  const handleStartSelection = () => setIsSelectingRoute(true);
  
  const handleConfirmSelection = (selectedOrders: Order[], selectedMotoboy: Motoboy) => {
    console.log('Confirmando pedidos:', selectedOrders, 'para motoboy:', selectedMotoboy);
    setIsSelectingRoute(false);
  };
  
  const handleCancelSelection = () => setIsSelectingRoute(false);

  /**
   * Centraliza o mapa na localização de um motoboy específico
   */
  const locateMotoboy = (motoboyId: number, isExpandedMap = false) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return;

    if (isExpandedMap) {
      expandedMapMarkers.flyTo(motoboy.location);
    } else {
      mainMapMarkers.flyTo(motoboy.location);
    }
  };

  /**
   * Exibe os detalhes de um motoboy específico
   */
  const showMotoboyDetails = (motoboyId: number) => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy || !mapRef.current) return;

    setActiveMotoboyId(motoboyId);
    setSelectedMotoboy(motoboy);
    setShowDetailsPanel(true);

    mainMapMarkers.flyTo(motoboy.location, 14);
  };

  // Handlers para controle de painéis e modais
  const closeDetailsPanel = () => {
    setShowDetailsPanel(false);
    setActiveMotoboyId(null);
  };

  const expandMap = () => setShowExpandedMap(true);
  const closeExpandedMap = () => setShowExpandedMap(false);

  /**
   * Atribui um pedido a um motoboy
   */
  const assignOrderToMotoboy = (motoboyId: number, orderId: number) => {
    console.log(`Atribuindo pedido ${orderId} ao motoboy ${motoboyId}`);
    // Aqui seria implementada a lógica de atribuição de pedido
  };

  /**
   * Destaca a rota até um pedido específico
   */
  function drawRouteUntil(pedido: Delivery, index: number, all: Delivery[]) {
    console.log('Highlight rota até pedido', pedido.id);
    // Aqui seria implementada a lógica de desenhar a rota no mapa
  }

  // Componente de botão expandir mapa
  const ExpandMapButton = () => (
    <button
      className={styles.expandButtonFloating}
      onClick={expandMap}
      aria-label="Expandir Mapa"
    >
      <i className="fas fa-expand" />
    </button>
  );

  // Componente de botão para selecionar rota
  const SelectRouteButton = () => (
    <button
      onClick={handleStartSelection}
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
  );

  return (
    <div className={styles.mapComponentContainer}>
      <div className={styles.map}>
        {!isSelectingRoute && <ExpandMapButton />}
        {!isSelectingRoute && <SelectRouteButton />}

        {isSelectingRoute ? (
          <SelectOrdersMode
            orders={orders.filter(order => order.status === 'pendente')}
            motoboys={motoboys}
            onConfirm={handleConfirmSelection}
            onCancel={handleCancelSelection}
            isChatOpen={isChatOpen}
          />
        ) : (
          <>
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
          </>
        )}
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