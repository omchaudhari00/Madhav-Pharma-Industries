import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (orderDetails: any) => {
  const doc = new jsPDF();
  
  // Header: Company details
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text('Madhav Pharma Industries', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001', 14, 28);
  doc.text('Email: info@madhavpharma.com | Phone: +91 9876543210', 14, 34);
  
  // Tax / GST Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 14, 45);
  doc.setFontSize(10);
  doc.text(`GSTIN: 24AAAAA0000A1Z5`, 14, 52);
  doc.text(`Order ID: ${orderDetails.id}`, 14, 58);
  doc.text(`Date: ${orderDetails.date}`, 14, 64);
  
  // Customer Details
  doc.setFontSize(11);
  doc.text('Billed To:', 120, 45);
  doc.setFontSize(10);
  doc.text(`${orderDetails.customerName}`, 120, 52);
  doc.text(`${orderDetails.phone}`, 120, 58);
  
  // Address formatting (simple split for demo)
  const addressLines = doc.splitTextToSize(orderDetails.deliveryAddress, 70);
  doc.text(addressLines, 120, 64);

  // Table Data Preparation
  const tableColumn = ["Item", "HSN/SAC", "Qty", "Rate", "Taxable Value", "GST (18%)", "Total"];
  const tableRows: any[] = [];
  
  let totalTaxableValue = 0;
  let totalGST = 0;
  let totalAmount = 0;

  orderDetails.items.forEach((item: any) => {
    // Assuming prices are inclusive of 18% GST for simplicity in this example
    // Or we can calculate it assuming unitPrice is exclusive of GST. Let's assume inclusive.
    const qty = item.quantity;
    const totalItemPrice = item.unitPrice * qty;
    
    // Reverse calculation of 18% GST (Amount = Taxable + 18% Taxable => Taxable = Amount / 1.18)
    const taxableValue = totalItemPrice / 1.18;
    const gstAmount = totalItemPrice - taxableValue;
    
    totalTaxableValue += taxableValue;
    totalGST += gstAmount;
    totalAmount += totalItemPrice;
    
    const row = [
      `${item.name}\n(${item.sizeLabel})`,
      '3301', // Example HSN for essential oils
      qty.toString(),
      `Rs ${item.unitPrice.toFixed(2)}`,
      `Rs ${taxableValue.toFixed(2)}`,
      `Rs ${gstAmount.toFixed(2)}`,
      `Rs ${totalItemPrice.toFixed(2)}`
    ];
    tableRows.push(row);
  });

  // @ts-ignore
  doc.autoTable({
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [212, 163, 115] },
    margin: { top: 10 },
  });

  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 150;
  
  // Summary
  doc.setFontSize(10);
  doc.text('Summary:', 120, finalY + 15);
  doc.text(`Total Taxable Value: Rs ${totalTaxableValue.toFixed(2)}`, 120, finalY + 22);
  doc.text(`Total GST (18%): Rs ${totalGST.toFixed(2)}`, 120, finalY + 29);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: Rs ${totalAmount.toFixed(2)}`, 120, finalY + 38);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text('Authorized Signatory', 14, finalY + 38);
  doc.text('For Madhav Pharma Industries', 14, finalY + 44);

  // Footer
  doc.setFontSize(8);
  doc.text('This is a computer generated invoice and does not require a signature.', 14, 280);

  doc.save(`Invoice_${orderDetails.id}.pdf`);
};
