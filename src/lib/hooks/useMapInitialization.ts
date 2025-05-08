import { useRef, useEffect, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates } from '../../components/ui/types';

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

    const mapOptions = { 
      ...defaultOptions, 
      ...options, 
    };

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

      // Lógica para adicionar o marcador
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.position = 'absolute';
      el.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = '/assets/img/pinPNG.png';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.pointerEvents = 'none';

      el.appendChild(img);

      new mapboxgl.Marker({ element: el })
        .setLngLat(center)
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, center[0], center[1], isActive]);

  return mapRef;
}

export default useMapInitialization;