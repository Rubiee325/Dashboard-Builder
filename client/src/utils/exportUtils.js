import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPDF = async () => {
  const element = document.querySelector(".layout");

  if (!element) {
    alert("Dashboard not found");
    return;
  }

  // ✅ WAIT FOR CHARTS TO RENDER
  await new Promise(resolve => setTimeout(resolve, 1000));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save("dashboard.pdf");
};