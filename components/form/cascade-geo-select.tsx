"use client";

import { useEffect, useState, useCallback } from "react";
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
import { useAuthFetcher } from "@/lib/use-auth-swr";

interface CascadeGeoSelectProps {
  regionId: number | "";
  prefectureId: number | "";
  communeId: number | "";
  onRegionChange: (value: number | "") => void;
  onPrefectureChange: (value: number | "") => void;
  onCommuneChange: (value: number | "") => void;
  hideCommune?: boolean;
  disabled?: boolean;
}

export function CascadeGeoSelect({
  regionId,
  prefectureId,
  communeId,
  onRegionChange,
  onPrefectureChange,
  onCommuneChange,
  hideCommune = false,
  disabled = false,
}: CascadeGeoSelectProps) {
  const fetcher = useAuthFetcher();
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
        const data = await fetcher("/api/api/v1/regions");
        setRegions(data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      } finally {
        setLoadingRegions(false);
      }
    }
    fetchRegions();
  }, [fetcher]);

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
        const data = await fetcher(`/api/api/v1/regions/${regionId}/prefectures`);
        setPrefectures(data);
      } catch (error) {
        console.error("Failed to fetch prefectures:", error);
      } finally {
        setLoadingPrefectures(false);
      }
    }
    fetchPrefectures();
  }, [regionId, fetcher]);

  // Fetch communes when prefecture changes
  useEffect(() => {
    if (!prefectureId) {
      setCommunes([]);
      return;
    }

    async function fetchCommunes() {
      setLoadingCommunes(true);
      try {
        const data = await fetcher(`/api/api/v1/prefectures/${prefectureId}/communes`);
        setCommunes(data);
      } catch (error) {
        console.error("Failed to fetch communes:", error);
      } finally {
        setLoadingCommunes(false);
      }
    }
    fetchCommunes();
  }, [prefectureId, fetcher]);

  const handleRegionChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    // Don't clear if we already have a value and new value is empty (prevents initialization clearing)
    if (numValue === "" && regionId) return;
    // Only update if value actually changed
    if (numValue === regionId) return;
    onRegionChange(numValue);
    // Clear dependent fields when region changes
    onPrefectureChange("");
    onCommuneChange("");
    setPrefectures([]);
    setCommunes([]);
  };

  const handlePrefectureChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    // Don't clear if we already have a value and new value is empty
    if (numValue === "" && prefectureId) return;
    // Only update if value actually changed
    if (numValue === prefectureId) return;
    onPrefectureChange(numValue);
    // Clear commune when prefecture changes
    onCommuneChange("");
    setCommunes([]);
  };

  const handleCommuneChange = (value: string) => {
    const numValue = value ? parseInt(value, 10) : "";
    // Don't clear if we already have a value and new value is empty
    if (numValue === "" && communeId) return;
    // Only update if value actually changed
    if (numValue === communeId) return;
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
          disabled={loadingRegions || disabled}
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
        <Label htmlFor="prefectureId">العمالة أو الإقليم</Label>
        <Select
          value={prefectureId ? String(prefectureId) : ""}
          onValueChange={handlePrefectureChange}
          disabled={!regionId || loadingPrefectures || disabled}
        >
          <SelectTrigger className="relative">
            <SelectValue placeholder={regionId ? "اختر العمالة أو الإقليم" : "اختر الجهة أولاً"} />
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
      {!hideCommune && (
        <div className="space-y-2">
          <Label htmlFor="communeId">الجماعة</Label>
          <Select
            value={communeId ? String(communeId) : ""}
            onValueChange={handleCommuneChange}
            disabled={!prefectureId || loadingCommunes}
          >
            <SelectTrigger className="relative">
              <SelectValue placeholder={prefectureId ? "اختر الجماعة" : "اختر العمالة أو الإقليم أولاً"} />
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
      )}
    </>
  );
}
