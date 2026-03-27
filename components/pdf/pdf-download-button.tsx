"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import type { InstitutionResponse } from "@/lib/types";
import { toast } from "sonner";

interface PDFDownloadButtonProps {
  data: InstitutionResponse;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PDFDownloadButton({ 
  data, 
  variant = "outline",
  size = "default" 
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const pdfData = {
        ...data,
        regionName: data.regionName || data.regionId?.toString(),
        prefectureName: data.prefectureName || data.prefectureId?.toString(),
        communeName: data.communeName || data.communeId?.toString(),
      };

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: pdfData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const html = await response.text();
      
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
