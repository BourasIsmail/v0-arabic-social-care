"use client";

import { useEffect, useRef, useState } from "react";

interface LocationMapDisplayProps {
  latitude: number;
  longitude: number;
  height?: string;
}

export function LocationMapDisplay({
  latitude,
  longitude,
  height = "200px",
}: LocationMapDisplayProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Load Leaflet CSS
  useEffect(() => {
    const existingLink = document.querySelector('link[href*="leaflet.css"]');
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = await import("leaflet");
        const leaflet = L.default || L;

        // Fix default marker icon
        const DefaultIcon = leaflet.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        leaflet.Marker.prototype.options.icon = DefaultIcon;

        // Create map
        const map = leaflet.map(mapContainerRef.current!, {
          center: [latitude, longitude],
          zoom: 14,
          scrollWheelZoom: false,
          dragging: true,
          zoomControl: true,
        });

        // Add tile layer
        leaflet.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        // Add marker
        leaflet.marker([latitude, longitude]).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);

        // Invalidate size after render
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full rounded-lg border overflow-hidden"
      style={{ height, background: "#f0f0f0" }}
    >
      {!mapReady && (
        <div className="h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">جاري تحميل الخريطة...</span>
        </div>
      )}
    </div>
  );
}
