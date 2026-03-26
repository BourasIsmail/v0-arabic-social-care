"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { GeoDTO } from "@/lib/types";

interface CascadeGeoSelectProps {
  regionId: number | "";
  prefectureId: number | "";
  communeId: number | "";
  onRegionChange: (value: number | "") => void;
  onPrefectureChange: (value: number | "") => void;
  onCommuneChange: (value: number | "") => void;
}

export function CascadeGeoSelect({
  regionId,
  prefectureId,
  communeId,
  onRegionChange,
  onPrefectureChange,
  onCommuneChange,
}: CascadeGeoSelectProps) {
  const [regions, setRegions] = useState<GeoDTO[]>([]);
  const [prefectures, setPrefectures] = useState<GeoDTO[]>([]);
  const [communes, setCommunes] = useState<GeoDTO[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingPrefectures, setLoadingPrefectures] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  // Fetch regions on mount
  useEffect(() => {
    async function fetchRegions() {
      setLoadingRegions(true);
      try {
        const res = await fetch("/api/geo/regions");
        if (res.ok) {
          const data = await res.json();
          setRegions(data);
        }
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      } finally {
        setLoadingRegions(false);
      }
    }
    fetchRegions();
  }, []);

  // Fetch prefectures when region changes
  useEffect(() => {
    if (!regionId) {
      setPrefectures([]);
      setCommunes([]);
      return;
    }

    async function fetchPrefectures() {
      setLoadingPrefectures(true);
      try {
        const res = await fetch(`/api/geo/regions/${regionId}/prefectures`);
        if (res.ok) {
          const data = await res.json();
          setPrefectures(data);
        }
      } catch (error) {
        console.error("Failed to fetch prefectures:", error);
      } finally {
        setLoadingPrefectures(false);
      }
    }
    fetchPrefectures();
  }, [regionId]);

  // Fetch communes when prefecture changes
  useEffect(() => {
    if (!prefectureId) {
      setCommunes([]);
      return;
    }

    async function fetchCommunes() {
      setLoadingCommunes(true);
      try {
        const res = await fetch(`/api/geo/prefectures/${prefectureId}/communes`);
        if (res.ok) {
          const data = await res.json();
          setCommunes(data);
        }
      } catch (error) {
        console.error("Failed to fetch communes:", error);
      } finally {
        setLoadingCommunes(false);
      }
    }
    fetchCommunes();
  }, [prefectureId]);

  const handleRegionChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    onRegionChange(numValue);
    onPrefectureChange("");
    onCommuneChange("");
    setPrefectures([]);
    setCommunes([]);
  };

  const handlePrefectureChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    onPrefectureChange(numValue);
    onCommuneChange("");
    setCommunes([]);
  };

  const handleCommuneChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    onCommuneChange(numValue);
  };

  return (
    <>
      {/* Region Select */}
      <div className="space-y-2">
        <Label htmlFor="regionId">الجهة</Label>
        <Select
          value={regionId ? String(regionId) : ""}
          onValueChange={handleRegionChange}
          disabled={loadingRegions}
        >
          <SelectTrigger className="relative">
            <SelectValue placeholder="اختر الجهة" />
            {loadingRegions && (
              <Loader2 className="absolute left-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.id} value={String(region.id)}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prefecture Select */}
      <div className="space-y-2">
        <Label htmlFor="prefectureId">العمالة / الإقليم</Label>
        <Select
          value={prefectureId ? String(prefectureId) : ""}
          onValueChange={handlePrefectureChange}
          disabled={!regionId || loadingPrefectures}
        >
          <SelectTrigger className="relative">
            <SelectValue placeholder={regionId ? "اختر العمالة / الإقليم" : "اختر الجهة أولاً"} />
            {loadingPrefectures && (
              <Loader2 className="absolute left-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </SelectTrigger>
          <SelectContent>
            {prefectures.map((prefecture) => (
              <SelectItem key={prefecture.id} value={String(prefecture.id)}>
                {prefecture.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Commune Select */}
      <div className="space-y-2">
        <Label htmlFor="communeId">الجماعة</Label>
        <Select
          value={communeId ? String(communeId) : ""}
          onValueChange={handleCommuneChange}
          disabled={!prefectureId || loadingCommunes}
        >
          <SelectTrigger className="relative">
            <SelectValue placeholder={prefectureId ? "اختر الجماعة" : "اختر العمالة / الإقليم أولاً"} />
            {loadingCommunes && (
              <Loader2 className="absolute left-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </SelectTrigger>
          <SelectContent>
            {communes.map((commune) => (
              <SelectItem key={commune.id} value={String(commune.id)}>
                {commune.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
