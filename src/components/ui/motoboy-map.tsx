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
 * Hook personalizado para gerenciar o redimensionamento do mapa
 * @param mapRef - Referência para a instância do mapa
 * @param dependencies - Array de dependências que devem disparar o redimensionamento
 */
function useMapResize(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  dependencies: any[]
) {
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Função para redimensionar o mapa
    const resizeMap = () => {
      // Verificamos se o mapa ainda existe
      if (mapRef.current) {
        // Usamos setTimeout para garantir que o DOM foi atualizado
        setTimeout(() => {
          mapRef.current?.resize();
        }, 100);
        
        // Também tentamos um segundo resize após mais tempo
        // para garantir que todas as transições de CSS foram concluídas
        setTimeout(() => {
          mapRef.current?.resize();
        }, 300);
      }
    };
    
    // Executamos o resize imediatamente
    resizeMap();
    
    // Criamos um observador de redimensionamento para capturar mudanças na janela
    const resizeObserver = new ResizeObserver((entries) => {
      resizeMap();
    });
    
    // Encontramos o container do mapa
    const mapContainer = mapRef.current.getContainer();
    
    // Observamos o container do mapa
    if (mapContainer) {
      resizeObserver.observe(mapContainer);
    }
    
    // Também observamos a janela para mudanças gerais
    window.addEventListener('resize', resizeMap);
    
    // Limpeza
    return () => {
      if (mapContainer) {
        resizeObserver.unobserve(mapContainer);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeMap);
    };
  }, dependencies);
}

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

  // Usando o hook personalizado para gerenciar o redimensionamento do mapa
  // quando o chat é aberto/fechado ou quando outras mudanças ocorrem
  useMapResize(mapRef, [isChatOpen, isSelectingRoute]);
  useMapResize(expandedMapRef, [showExpandedMap]);

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

  // Este efeito adiciona um evento de resize na janela para garantir que o mapa será redimensionado
  // quando qualquer alteração no layout ocorrer
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
      if (expandedMapRef.current && showExpandedMap) {
        expandedMapRef.current.resize();
      }
    };

    // Executa no mount e quando as dependências mudam
    handleResize();

    // Detecta mudanças no tamanho da janela
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isChatOpen, showExpandedMap]); // re-executa quando o chat ou o mapa expandido mudam

  return (
    <div className={styles.mapComponentContainer} data-chat-open={isChatOpen ? 'true' : 'false'}>
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