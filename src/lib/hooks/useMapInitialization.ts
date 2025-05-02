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
    if (!isActive || !containerRef.current) return;

    if (mapRef.current && mapRef.current.getContainer() === containerRef.current) {
      // Se o mapa já está correto no container, não faz nada
      return;
    }

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Mapbox access token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.');
      return;
    }

    mapboxgl.accessToken = accessToken;

    const defaultOptions = {
      zoom: 13,
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false,
    };

    const mapOptions = { ...defaultOptions, ...options };

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapOptions.style,
      center: center,
      zoom: mapOptions.zoom,
      attributionControl: mapOptions.attributionControl,
      maxBounds: mapOptions.maxBounds,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      if (onMapLoaded) {
        onMapLoaded(map);
      }

      const popup = new mapboxgl.Popup()
        .setLngLat(center)
        .setHTML('<div class="mapboxgl-popup-content">Conteúdo do popup</div>')
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, center[0], center[1], isActive]);

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

  if (mapRef.current) {
    (mapRef as any).resize = resizeMap;
  }

  return mapRef;
}

export default useMapInitialization;