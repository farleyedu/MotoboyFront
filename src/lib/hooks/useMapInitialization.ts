// src/lib/hooks/useMapInitialization.ts

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinates } from '../../components/ui/types';

export default function useMapInitialization(
  containerRef: React.RefObject<HTMLDivElement | null>,
  center: Coordinates,
  shouldInitialize: boolean,
  onLoad?: (map: mapboxgl.Map) => void,
  onMapReady?: (map: mapboxgl.Map) => void
) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!shouldInitialize || !containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 12.5,
    });

    mapRef.current = map;
    if (onMapReady) onMapReady(map);

    map.on('load', () => {
      if (onLoad) onLoad(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [shouldInitialize, containerRef]);

  return mapRef;
}
