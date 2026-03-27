"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Printer } from "lucide-react";
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

  const generateHtml = async () => {
    // Prepare data with region/prefecture names
    const pdfData = {
      ...data,
      regionName: data.regionName || data.regionId?.toString(),
      prefectureName: data.prefectureName || data.prefectureId?.toString(),
      communeName: data.communeName || data.communeId?.toString(),
    };

    // Call the API to generate HTML
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

    return await response.text();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const html = await generateHtml();
      
      // Open in new window for print/save as PDF
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        toast.info("استخدم 'حفظ كـ PDF' من قائمة الطباعة لتحميل الملف");
      } else {
        toast.error("يرجى السماح بالنوافذ المنبثقة");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء الملف");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const html = await generateHtml();
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        toast.error("يرجى السماح بالنوافذ المنبثقة للطباعة");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء الملف");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
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
            <FileDown className="h-4 w-4" />
            تحميل PDF
          </>
        )}
      </Button>
      
      <Button
        variant="ghost"
        size={size}
        onClick={handlePrint}
        disabled={isGenerating}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        طباعة
      </Button>
    </div>
  );
}
