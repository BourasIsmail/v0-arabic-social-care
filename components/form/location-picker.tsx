"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Locate, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// Morocco center coordinates
const MOROCCO_CENTER: [number, number] = [31.7917, -7.0926];
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 14;

function LocationPickerInner({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [manualLat, setManualLat] = useState<string>(latitude?.toString() || "");
  const [manualLng, setManualLng] = useState<string>(longitude?.toString() || "");

  // Load Leaflet CSS when component mounts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize map when dialog opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamic import of Leaflet
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon issue
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      // Clean up previous map if exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      // Determine initial position
      const hasExistingLocation = latitude && longitude;
      const initialCenter: [number, number] = hasExistingLocation
        ? [latitude, longitude]
        : MOROCCO_CENTER;
      const initialZoom = hasExistingLocation ? SELECTED_ZOOM : DEFAULT_ZOOM;

      // Create map
      const map = L.map(mapContainerRef.current!, {
        center: initialCenter,
        zoom: initialZoom,
      });

      // Add tile layer (ArcGIS World Street Map)
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add marker if location exists
      if (hasExistingLocation) {
        markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(map);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current!.getLatLng();
          setManualLat(pos.lat.toFixed(6));
          setManualLng(pos.lng.toFixed(6));
        });
      }

      // Handle map click
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        
        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current!.getLatLng();
            setManualLat(pos.lat.toFixed(6));
            setManualLng(pos.lng.toFixed(6));
          });
        }
        
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
      });

      mapRef.current = map;
      setMapReady(true);

      // Fix map rendering issue by invalidating size after dialog animation
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);
    };

    // Small delay to ensure dialog is fully rendered
    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      setMapReady(false);
    };
  }, [isOpen, latitude, longitude]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("الموقع الجغرافي غير مدعوم في هذا المتصفح");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], SELECTED_ZOOM);
          
          const L = (await import("leaflet")).default;
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
            markerRef.current.on("dragend", () => {
              const pos = markerRef.current!.getLatLng();
              setManualLat(pos.lat.toFixed(6));
              setManualLng(pos.lng.toFixed(6));
            });
          }
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.error("Error getting location:", error);
        alert("تعذر الحصول على الموقع الحالي");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle manual coordinate input
  const handleManualUpdate = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("يرجى إدخال إحداثيات صحيحة");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("الإحداثيات خارج النطاق المسموح");
      return;
    }

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], SELECTED_ZOOM);
      
      const L = (await import("leaflet")).default;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current!.getLatLng();
          setManualLat(pos.lat.toFixed(6));
          setManualLng(pos.lng.toFixed(6));
        });
      }
    }
  };

  // Save location
  const handleSave = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("يرجى تحديد موقع على الخريطة أو إدخال إحداثيات صحيحة");
      return;
    }
    
    onLocationChange(lat, lng);
    setIsOpen(false);
  };

  // Clear location
  const handleClear = () => {
    setManualLat("");
    setManualLng("");
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-2">
      <Label>الموقع الجغرافي (خط العرض وخط الطول)</Label>
      <div className="flex gap-2">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Input
            type="text"
            value={latitude?.toFixed(6) || ""}
            placeholder="خط العرض"
            readOnly
            className="bg-muted"
          />
          <Input
            type="text"
            value={longitude?.toFixed(6) || ""}
            placeholder="خط الطول"
            readOnly
            className="bg-muted"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              تحديد على الخريطة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>تحديد الموقع على الخريطة</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Manual coordinates input */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">خط العرض (Latitude)</Label>
                  <Input
                    type="text"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="مثال: 31.7917"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">خط الطول (Longitude)</Label>
                  <Input
                    type="text"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    placeholder="مثال: -7.0926"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleManualUpdate}>
                  تحديث
                </Button>
              </div>

              {/* Map container */}
              <div
                ref={mapContainerRef}
                className="h-[400px] w-full rounded-lg border bg-muted relative"
                style={{ zIndex: 0 }}
              >
                {!mapReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground">جاري تحميل الخريطة...</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Locate className="h-4 w-4" />
                    {isLoading ? "جاري التحديد..." : "موقعي الحالي"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    مسح
                  </Button>
                </div>
                <Button type="button" onClick={handleSave}>
                  حفظ الموقع
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                انقر على الخريطة لتحديد الموقع، أو اسحب العلامة لتعديل الموقع، أو أدخل الإحداثيات يدوياً
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Export with dynamic to avoid SSR issues
export const LocationPicker = dynamic(
  () => Promise.resolve(LocationPickerInner),
  { ssr: false }
);
