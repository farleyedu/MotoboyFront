/**
 * Definições de tipos para o projeto de gerenciamento de motoboys
 */

import mapboxgl from 'mapbox-gl';

/**
 * Coordenadas geográficas no formato [longitude, latitude]
 */
export type Coordinates = [number, number];

/**
 * Status possíveis para uma entrega
 */
export type DeliveryStatus = "em_rota" | "proxima" | "concluida";

/**
 * Status possíveis para um motoboy
 */
export type MotoboyStatus = "online" | "offline" | "delivering";

/**
 * Informações de uma entrega
 */
export interface Delivery {
  id: number;
  status: DeliveryStatus;
  address: string;
  items: string;
  value: string;
  departureTime: string;
  eta: string;
  etaMinutes: number;
  coordinates: Coordinates;
}

/**
 * Informações de um motoboy
 */
export interface Motoboy {
  id: number;
  name: string;
  avatar?: string;
  phone?: string;
  vehicle?: string;
  status: MotoboyStatus;
  location: Coordinates;
  deliveries: Delivery[];
}

/**
 * Informações de um pedido
 */
export interface Order {
  id: number;
  address?: string;
  items: string | string[];
  value?: string;
  region?: string;
  status?: string;
  assigned_driver?: number;
  coordinates: Coordinates;
  horarioPedido?: string;
  previsaoEntrega?: string;
  horarioSaida?: string;
  horarioEntrega?: string;
  motoboy?: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
  };
}

/**
 * Referência a um marcador no mapa
 */
export interface MarkerRef {
  id: number;
  marker: mapboxgl.Marker;
  element: HTMLDivElement;
  isExpandedMap: boolean;
}

/**
 * Props para o componente MapComponent
 */
export interface MapComponentProps {
  pizzeriaLocation: Coordinates;
  motoboys: Motoboy[];
  orders: Order[];
  isChatOpen: boolean;
}

/**
 * Props para o componente MotoboyList
 */
export interface MotoboyListProps {
  motoboys: Motoboy[];
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (id: number) => void;
  activeMotoboy: number | null;
  onHoverPedido?: (pedido: Delivery, index: number, all: Delivery[]) => void;
}

/**
 * Props para o componente DeliveryDetailsPanel
 */
export interface DeliveryDetailsPanelProps {
  motoboy: Motoboy;
  pendingOrders: Order[];
  onClose: () => void;
  onAssignOrder: (motoboyId: number, orderId: number) => void;
}

/**
 * Props para o componente ExpandedMapModal
 */
export interface ExpandedMapModalProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  motoboys: Motoboy[];
  onClose: () => void;
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (id: number) => void;
}

/**
 * Props para o componente SelectOrdersMode
 */
export interface SelectOrdersModeProps {
  orders: Order[];
  motoboys: Motoboy[];
  onConfirm: (selectedOrders: Order[], selectedMotoboy: Motoboy) => void;
  onCancel: () => void;
  isChatOpen: boolean;
}