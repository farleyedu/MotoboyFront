import { useRef, useEffect, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates } from '../../components/ui/types';

/**
 * Hook personalizado para gerenciar a inicialização e limpeza do mapa Mapbox
 * 
 * @param containerRef - Referência para o elemento HTML onde o mapa será renderizado
 * @param center - Coordenadas iniciais do centro do mapa
 * @param isActive - Flag que controla quando o mapa deve ser inicializado
 * @param onMapLoaded - Callback executado quando o mapa é carregado
 * @param options - Opções adicionais de configuração do mapa
 * 
 * @returns Referência para a instância do mapa
 */
export function useMapInitialization(
  containerRef: MutableRefObject<HTMLDivElement | null>,
  center: Coordinates,
  isActive: boolean,
  onMapLoaded?: (map: mapboxgl.Map) => void,
  options?: {
    zoom?: number;
    style?: string;
    attributionControl?: boolean;
    maxBounds?: mapboxgl.LngLatBoundsLike;
  }
): MutableRefObject<mapboxgl.Map | null> {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  useEffect(() => {
    // Se o modo de seleção estiver ativo ou o mapa já estiver inicializado, não faça nada
    if (!isActive || mapRef.current || !containerRef.current) return;

    // Configurações padrão do mapa
    const defaultOptions = {
      zoom: 13,
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false,
    };

    // Mescla as opções padrão com as opções personalizadas
    const mapOptions = { ...defaultOptions, ...options };

    // Inicializa o mapa
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapOptions.style,
      center,
      zoom: mapOptions.zoom,
      attributionControl: mapOptions.attributionControl,
      maxBounds: mapOptions.maxBounds,
    });

    mapRef.current = map;

    // Adiciona controles de navegação
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Quando o mapa terminar de carregar, executa o callback
    map.on('load', () => {
      if (onMapLoaded) {
        onMapLoaded(map);
      }
    });

    // Função de limpeza quando o componente for desmontado
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, center, isActive, onMapLoaded, options]);

  /**
   * Método para redimensionar o mapa (útil quando o contêiner muda de tamanho)
   */
  const resizeMap = () => {
    if (mapRef.current) {
      requestAnimationFrame(() => {
        mapRef.current?.resize();
      });
    }
  };

  // Adiciona o método resize ao objeto da referência para facilitar o acesso
  if (mapRef.current) {
    (mapRef as any).resize = resizeMap;
  }

  return mapRef;
}

export default useMapInitialization;