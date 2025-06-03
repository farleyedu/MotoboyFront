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
  const hasLoaded = useRef(false);

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
      if (!hasLoaded.current && onLoad) {
        onLoad(map);
        hasLoaded.current = true;
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      hasLoaded.current = false;
    };
  }, [shouldInitialize, containerRef, center]); // ❌ onLoad fora das deps

  return mapRef;
}
