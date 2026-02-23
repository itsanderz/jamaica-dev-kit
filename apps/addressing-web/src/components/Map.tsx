"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import maplibregl from "maplibre-gl";
import { encode } from "@/lib/api";
import type { LocationResponse } from "@/lib/api";

/** Jamaica geographic center and bounding box */
const JAMAICA_CENTER: [number, number] = [-77.2975, 18.1096]; // [lng, lat]
const JAMAICA_ZOOM = 9;

export interface MapHandle {
  flyTo(lng: number, lat: number, zoom?: number): void;
  setMarker(lng: number, lat: number): void;
}

interface MapProps {
  onLocationSelect?: (location: LocationResponse) => void;
}

const Map = forwardRef<MapHandle, MapProps>(function Map(
  { onLocationSelect },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [loading, setLoading] = useState(false);

  /** Create a custom marker element styled in Jamaica green */
  const createMarkerElement = useCallback(() => {
    const el = document.createElement("div");
    el.className = "marker-pulse";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#009B3A";
    el.style.border = "3px solid #FFFFFF";
    el.style.cursor = "pointer";
    return el;
  }, []);

  /** Place or move the marker */
  const setMarker = useCallback(
    (lng: number, lat: number) => {
      if (!mapRef.current) return;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new maplibregl.Marker({
          element: createMarkerElement(),
        })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      }
    },
    [createMarkerElement]
  );

  /** Fly the camera to a location */
  const flyTo = useCallback(
    (lng: number, lat: number, zoom?: number) => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom ?? 14,
        duration: 1500,
      });
    },
    []
  );

  /** Expose methods to parent via ref */
  useImperativeHandle(
    ref,
    () => ({
      flyTo,
      setMarker,
    }),
    [flyTo, setMarker]
  );

  /** Handle map click -- encode coordinates to Plus Code */
  const handleMapClick = useCallback(
    async (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setMarker(lng, lat);
      setLoading(true);

      try {
        const location = await encode(lat, lng);
        onLocationSelect?.(location);
      } catch (err) {
        // If the API is unavailable, still show coordinates
        console.error("Encode API error:", err);
        onLocationSelect?.({
          plus_code: "API unavailable",
          latitude: lat,
          longitude: lng,
          parish: undefined,
          formatted_address: undefined,
        });
      } finally {
        setLoading(false);
      }
    },
    [setMarker, onLocationSelect]
  );

  /** Initialize the map */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: JAMAICA_CENTER,
      zoom: JAMAICA_ZOOM,
      minZoom: 7,
      maxBounds: [
        [-79.5, 16.5], // SW
        [-75.0, 19.5], // NE
      ],
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      "bottom-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Register click handler (re-registers when callback changes) */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClick = (e: maplibregl.MapMouseEvent) => handleMapClick(e);

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [handleMapClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-10">
          <div className="w-4 h-4 border-2 border-jamaica-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-700">Generating address...</span>
        </div>
      )}

      {/* Instruction overlay when no location selected */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-lg px-4 py-2 text-sm pointer-events-none z-10 md:block hidden">
        Click anywhere on the map to generate a Plus Code address
      </div>
    </div>
  );
});

export default Map;
