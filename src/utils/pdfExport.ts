import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Reading, Patient } from './db';

export const exportToPDF = async (patient: Patient, readings: Reading[], period: string, chartImage?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header 
  doc.setFontSize(22);
  doc.setTextColor(13, 148, 136); // #0d9488
  doc.text('GlucoBridge — Patient Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // #64748b
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

  // Patient Info Section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // #1e293b
  doc.text('Patient Information', 14, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${patient.name}`, 14, 52);
  doc.text(`Age / Gender: ${patient.age} / ${patient.gender}`, 14, 57);
  doc.text(`Diabetes Type: ${patient.diabetesType}`, 14, 62);
  doc.text(`City: ${patient.city}`, 14, 67);

  // Summary Stats
  const stats = {
    avg: Math.round(readings.reduce((acc, r) => acc + r.value, 0) / (readings.length || 1)),
    max: Math.max(...readings.map(r => r.value), 0),
    min: Math.min(...readings.map(r => r.value), 0),
  };

  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Summary Statistics', 14, 82);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Average Glucose: ${stats.avg} mg/dL`, 14, 89);
  doc.text(`Highest Recorded: ${stats.max} mg/dL`, 14, 94);
  doc.text(`Lowest Recorded: ${stats.min} mg/dL`, 14, 99);

  // Include Chart if available
  let startTableAt = 110;
  if (chartImage) {
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Glucose Trend Graph', 14, 115);
    doc.addImage(chartImage, 'PNG', 14, 120, 180, 60);
    startTableAt = 190;
  }

  // Table
  autoTable(doc, {
    startY: startTableAt,
    head: [['Date', 'Time', 'Reading (mg/dL)', 'Status']],
    body: readings.slice(0, 100).map(r => [
      new Date(r.timestamp).toLocaleDateString(),
      new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      r.value,
      r.triageStatus
    ]),
    headStyles: { fillColor: [13, 148, 136] }, // teal-600
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
    margin: { top: startTableAt }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // #94a3b8
    doc.text(
      'GlucoBridge — Empowering diabetes care in Pakistan. This is an AI-assisted report, consult a doctor for diagnosis.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`GlucoBridge_Report_${patient.name}_${period}.pdf`);
};

