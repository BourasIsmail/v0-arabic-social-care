"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Printer } from "lucide-react";
import type { InstitutionResponse } from "@/lib/types";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { InstitutionPDF } from "./institution-pdf";

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

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF blob using @react-pdf/renderer
      const blob = await pdf(<InstitutionPDF data={data} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_${data.institutionName || 'مؤسسة'}_${new Date().toLocaleDateString('ar-MA')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("تم تحميل الملف بنجاح");
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
      // Generate PDF blob
      const blob = await pdf(<InstitutionPDF data={data} />).toBlob();
      
      // Open in new window for printing
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
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
