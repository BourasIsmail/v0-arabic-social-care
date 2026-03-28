"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import type { InstitutionResponse } from "@/lib/types";
import { toast } from "sonner";
import { generatePrintableHTML } from "@/lib/pdf-generator";

interface PDFDownloadButtonProps {
  data: InstitutionResponse;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

// Convert image to base64 data URL
async function imageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function PDFDownloadButton({ 
  data, 
  variant = "outline",
  size = "default" 
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Pre-load and convert logo to base64 on mount
  useEffect(() => {
    imageToBase64('/images/header-logos.png')
      .then(setLogoBase64)
      .catch(err => console.error('Failed to load logo:', err));
  }, []);

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      // Get logo base64 if not already loaded
      let logo = logoBase64;
      if (!logo) {
        try {
          logo = await imageToBase64('/images/header-logos.png');
        } catch {
          console.error('Failed to load logo for PDF');
        }
      }

      // Prepare data with geo names
      const pdfData = {
        ...data,
        regionName: data.regionName || data.regionId?.toString(),
        prefectureName: data.prefectureName || data.prefectureId?.toString(),
        communeName: data.communeName || data.communeId?.toString(),
      };

      // Generate HTML on client-side with logo base64
      const html = generatePrintableHTML(pdfData as InstitutionResponse, logo || undefined);
      
      // Open print window
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      } else {
        toast.error("يرجى السماح بالنوافذ المنبثقة لعرض التقرير");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء الملف");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري الإنشاء...
        </>
      ) : (
        <>
          <Printer className="h-4 w-4" />
          طباعة التقرير
        </>
      )}
    </Button>
  );
}
