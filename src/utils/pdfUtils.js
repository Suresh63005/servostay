import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePdf = (data, backgroundImage) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("INVOICE", 14, 20);
  doc.setFontSize(12);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);

  doc.addImage(backgroundImage, "JPEG", 160, 10, 30, 30);

  doc.setFontSize(10);
  doc.text("Billed to:", 14, 40);
  doc.text(data.customerName, 14, 45);
  doc.text(data.customerAddress, 14, 50);
  doc.text(`Mobile: ${data.customerMobile}`, 14, 55);

  doc.text("From:", 120, 40);
  doc.text("Your Company Name", 120, 45);
  doc.text("123 Address, City, Country", 120, 50);
  doc.text("Email: support@company.com", 120, 55);

  // Section Divider
  doc.line(10, 60, 200, 60);

  // Order Details Table
  autoTable(doc, {
    startY: 65,
    head: [["Description", "Amount"]],
    body: [
      ["Subtotal", `${data.subtotal.toString().replace(/\s/g, "")}.00`],
      ["Total Day's", `${data.totalDays}`],
      ["Tax", `${data.tax.toString().replace(/\s/g, "")}`],
      ["Net Amount (Paid)", `${data.netAmount.toString().replace(/\s/g, "")}.00`],
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      1: { halign: "right" },
    },
    didDrawCell: (data) => {
      if (data.column.index === 1 && typeof data.cell.raw === "string") {
        data.cell.raw = data.cell.raw.replace(/\s/g, ""); // Remove spaces
      }
      console.log(data.row.index, data.cell.raw);
    },
  });

  doc.line(10, 60, 200, 60);

  // Payment & Property Details Table
  autoTable(doc, {
    startY: doc.previousAutoTable.finalY + 10,
    head: [["Description", "Details"]],
    body: [
      ["Payment Gateway", data.paymentGateway],
      ["Property Title", data.propertyTitle],
      ["Property Image", "N/A"],
      ["Property Check-In Date", data.checkInDate.split('-').reverse().join('-')],
      ["Property Check-Out Date", data.checkOutDate.split('-').reverse().join('-')]
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: 14, right: 14 },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  // Section: Additional Information
  doc.setFontSize(12);
  doc.text("Property Address", 14, doc.previousAutoTable.finalY + 10);
  doc.setFontSize(10);
  doc.text(data.propertyAddress, 14, doc.previousAutoTable.finalY + 15);
  doc.text(`Booking Owner Name: ${data.customerName}`, 14, doc.previousAutoTable.finalY + 20);
  doc.text(`Booking Owner Mobile: ${data.customerMobile}`, 14, doc.previousAutoTable.finalY + 25);
  doc.text(`Transaction ID: ${data.transactionId}`, 14, doc.previousAutoTable.finalY + 30);
  doc.text(`Booking Status: ${data.bookingStatus}`, 14, doc.previousAutoTable.finalY + 35);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for choosing us!", 14, 280);
  doc.text("For support, contact: support@company.com", 14, 285);

  doc.save("order_preview.pdf");
};