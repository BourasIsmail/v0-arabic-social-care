"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Printer } from "lucide-react";
import type { InstitutionResponse } from "@/lib/types";
import { toast } from "sonner";

declare global {
  interface Window {
    html2pdf: any;
  }
}

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
  const [showPrintOption, setShowPrintOption] = useState(false);
  const [printableHtml, setPrintableHtml] = useState<string | null>(null);
  const [html2pdfLoaded, setHtml2pdfLoaded] = useState(false);

  // Load html2pdf from CDN only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = () => {
        setHtml2pdfLoaded(true);
      };
      script.onerror = () => {
        console.log('html2pdf CDN failed to load, using print fallback');
      };
      document.head.appendChild(script);
    } else if (window.html2pdf) {
      setHtml2pdfLoaded(true);
    }
  }, []);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
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

      const html = await response.text();
      setPrintableHtml(html);

      // If html2pdf is available, use it for direct download
      if (html2pdfLoaded && window.html2pdf) {
        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        // Get the content div
        const content = container.querySelector('.content') || container;

        // Generate PDF
        const fileName = `تقرير_${data.institutionName || 'مؤسسة'}_${new Date().toLocaleDateString('ar-MA')}.pdf`;
        
        await window.html2pdf()
          .set({
            margin: [10, 10, 10, 10],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2, 
              useCORS: true,
              letterRendering: true,
              logging: false
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait' 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          })
          .from(content)
          .save();

        // Remove temporary container
        document.body.removeChild(container);
        toast.success("تم تحميل الملف بنجاح");
      } else {
        // Fallback: Open in new window with print dialog
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          toast.info("يرجى استخدام 'حفظ كـ PDF' من قائمة الطباعة");
          setTimeout(() => {
            printWindow.print();
          }, 500);
        } else {
          toast.error("يرجى السماح بالنوافذ المنبثقة");
        }
      }
      
      setShowPrintOption(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("حدث خطأ أثناء إنشاء الملف");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!printableHtml) return;
    
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(printableHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      toast.error("يرجى السماح بالنوافذ المنبثقة للطباعة");
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
      
      {showPrintOption && (
        <Button
          variant="ghost"
          size={size}
          onClick={handlePrint}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          طباعة
        </Button>
      )}
    </div>
  );
}
