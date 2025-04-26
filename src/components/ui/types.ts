// Definições de tipos para o projeto de gerenciamento de motoboys




export type Coordinates = [number, number];

export type DeliveryStatus = "em_rota" | "proxima" | "concluida";

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

export interface Motoboy {
  id: number;
  name: string;
  avatar?: string;
  phone?: string;
  vehicle?: string;
  status: "online" | "offline" | "delivering";
  location: Coordinates;
  deliveries: Delivery[];
}

export interface Order {
  id: number;
  address?: string;
  items: string | string[];
  value?: string;
  region?: string;
  status?: string;
  assigned_driver?: number;
  coordinates: Coordinates; // importante para marcar no mapa
}

























// Informações de um pedido
export interface Order {
  id: number;
  address?: string;
  items: string | string[];
  value?: string;
  region?: string;
  assigned_driver?: number;
}

// Referência a um marcador no mapa
export interface MarkerRef {
  id: number;
  marker: mapboxgl.Marker;
  element: HTMLDivElement;
  isExpandedMap: boolean;
}

// Props para o componente MapComponent
export interface MapComponentProps {
  pizzeriaLocation: Coordinates;
  motoboys: Motoboy[];
  orders: Order[];
}

// Props para o componente MotoboyList
export interface MotoboyListProps {
  motoboys: Motoboy[];
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (id: number) => void;
  activeMotoboy: number | null;
}

// Props para o componente DeliveryDetailsPanel
export interface DeliveryDetailsPanelProps {
  motoboy: Motoboy;
  pendingOrders: Order[];
  onClose: () => void;
  onAssignOrder: (motoboyId: number, orderId: number) => void;
}

// Props para o componente ExpandedMapModal
export interface ExpandedMapModalProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  motoboys: Motoboy[];
  onClose: () => void;
  onLocateMotoboy: (id: number) => void;
  onShowDetails: (id: number) => void;
}
