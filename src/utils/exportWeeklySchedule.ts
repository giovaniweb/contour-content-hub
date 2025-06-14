
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exporta um elemento (calendário) como imagem PNG.
 * @param elementId O ID do elemento DOM a exportar
 * @returns Blob da imagem PNG
 */
export async function exportElementAsImage(elementId: string): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;
  const canvas = await html2canvas(element, { scale: 2 });
  return new Promise((resolve) => {
    canvas.toBlob(blob => resolve(blob), "image/png");
  });
}

/**
 * Exporta um elemento (calendário) como PDF.
 * @param elementId O ID do elemento DOM a exportar
 * @param pdfTitle Título do PDF
 */
export async function exportElementAsPDF(elementId: string, pdfTitle = "CalendarioSemanal"): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // Dimensões A4 - retrato
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4"
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Ajuste a imagem para não extrapolar o A4 (mantendo proporção)
  const imgProps = pdf.getImageProperties(imgData);
  const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
  const imgWidth = imgProps.width * ratio;
  const imgHeight = imgProps.height * ratio;
  const x = (pageWidth - imgWidth) / 2;
  const y = 20; // topo

  pdf.text(pdfTitle, pageWidth / 2, 15, { align: "center" });
  pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

  // Export PDF como Blob
  return pdf.output("blob");
}

/**
 * Faz download direto de um blob/arquivo
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
