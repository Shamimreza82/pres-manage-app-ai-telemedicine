import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

export const generatePrescriptionPDF = async (data: {
  doctor: any;
  patient: any;
  medicines: any[];
  investigations: any[];
  prescriptionNo: string;
  createdAt: string;
  symptoms?: string | null;
  chiefComplaint?: string | null;
  diagnosis?: string | null;
  diagnosisNotes?: string | null;
  bloodPressure?: string | null;
  pulseRate?: string | null;
  temperature?: string | null;
  oxygenSaturation?: string | null;
  advice?: string | null;
  foodAdvice?: string | null;
  followUpDate?: string | Date | null;
}): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primary = '#1a56db';
    const gray = '#6b7280';

    const uploadsDir = path.join(__dirname, '../../../uploads');

    const tryImage = (filename: string | null | undefined, x: number, y: number, w: number) => {
      if (!filename) return;
      try {
        const p = path.join(uploadsDir, filename);
        if (fs.existsSync(p)) doc.image(p, x, y, { width: w });
      } catch {}
    };

    tryImage(data.doctor.clinicLogo, 40, 40, 70);

    doc.fontSize(22).font('Helvetica-Bold').fillColor(primary)
      .text(data.doctor.clinicName || 'Clinic', 120, 45);
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text(data.doctor.clinicAddress || '', 120, 72)
      .text(`Phone: ${data.doctor.phone || ''}`, 120, 85);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827')
      .text(`Dr. ${data.doctor.fullName}`, 40, 130);
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text((data.doctor.degree || []).join(', '), 40, 145)
      .text((data.doctor.specialization || []).join(', '), 40, 158)
      .text(`BMDC: ${data.doctor.bmdcRegNo}`, 40, 171);
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text(`Rx: ${data.prescriptionNo}`, 350, 130, { align: 'right' })
      .text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 350, 143, { align: 'right' });

    doc.moveTo(40, 188).lineTo(552, 188).strokeColor('#e5e7eb').stroke();

    let y = 205;
    doc.fontSize(13).font('Helvetica-Bold').fillColor(primary).text('Patient Information', 40, y);
    y += 22;
    const fields = [
      ['Name', data.patient.fullName],
      ['ID', data.patient.patientId],
      ['Age', `${data.patient.age} years`],
      ['Gender', data.patient.gender],
      ['Weight', data.patient.weight ? `${data.patient.weight} kg` : 'N/A'],
    ];
    fields.forEach(([l, v]) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#111827').text(`${l}:`, 40, y);
      doc.font('Helvetica').fillColor(gray).text(`${v}`, 130, y);
      y += 16;
    });

    const vitals = [
      { l: 'BP', v: data.bloodPressure },
      { l: 'Pulse', v: data.pulseRate },
      { l: 'Temp', v: data.temperature },
      { l: 'SpO2', v: data.oxygenSaturation },
    ].filter((x) => x.v);
    if (vitals.length) {
      y += 5;
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Vital Signs', 40, y);
      y += 18;
      vitals.forEach((v) => {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#111827').text(`${v.l}:`, 40, y);
        doc.font('Helvetica').fillColor(gray).text(v.v || '', 90, y);
        y += 14;
      });
    }

    if (data.chiefComplaint) {
      y += 5;
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Chief Complaint', 40, y);
      y += 16;
      doc.fontSize(10).font('Helvetica').fillColor('#111827').text(data.chiefComplaint, 40, y);
      y += 20;
    }
    if (data.diagnosis) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Diagnosis', 40, y);
      y += 16;
      doc.fontSize(10).font('Helvetica').fillColor('#111827').text(data.diagnosis, 40, y);
      y += 20;
    }
    if (data.diagnosisNotes) {
      doc.fontSize(10).font('Helvetica-Oblique').fillColor(gray).text(data.diagnosisNotes, 40, y);
      y += 20;
    }

    if (y > 500) { doc.addPage(); y = 40; }

    doc.fontSize(13).font('Helvetica-Bold').fillColor(primary).text('Medicines', 40, y);
    y += 22;
    if (data.medicines?.length) {
      const colWidths = [140, 90, 90, 90, 80];
      const headers = ['Medicine', 'Dosage', 'Frequency', 'Duration', 'Instr.'];
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#374151');
      let x = 40;
      headers.forEach((h, i) => { doc.text(h, x, y, { width: colWidths[i] }); x += colWidths[i]; });
      y += 16;
      doc.moveTo(40, y - 4).lineTo(552, y - 4).strokeColor('#e5e7eb').stroke();
      doc.fontSize(9).font('Helvetica').fillColor('#111827');
      data.medicines.forEach((m: any) => {
        x = 40;
        doc.text(`${m.name}${m.strength ? ` ${m.strength}` : ''}`, x, y, { width: colWidths[0] });
        x += colWidths[0];
        doc.text(m.dosage, x, y, { width: colWidths[1] }); x += colWidths[1];
        doc.text(m.frequency, x, y, { width: colWidths[2] }); x += colWidths[2];
        doc.text(m.duration, x, y, { width: colWidths[3] }); x += colWidths[3];
        doc.text(m.instructions || '', x, y, { width: colWidths[4] });
        y += 20;
        if (y > 700) { doc.addPage(); y = 40; }
      });
    }

    y += 10;
    if (data.investigations?.length) {
      if (y > 600) { doc.addPage(); y = 40; }
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Investigations', 40, y);
      y += 18;
      data.investigations.forEach((inv: any) => {
        doc.fontSize(10).font('Helvetica').fillColor('#111827').text(`• ${inv.name}`, 40, y);
        y += 16;
        if (inv.notes) { doc.fontSize(9).font('Helvetica-Oblique').fillColor(gray).text(inv.notes, 55, y); y += 14; }
      });
    }

    if (data.advice) {
      if (y > 600) { doc.addPage(); y = 40; }
      y += 5;
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Advice', 40, y);
      y += 18;
      doc.fontSize(10).font('Helvetica').fillColor('#111827').text(data.advice, 40, y);
      y += 20;
    }
    if (data.foodAdvice) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Food Advice', 40, y);
      y += 18;
      doc.fontSize(10).font('Helvetica').fillColor('#111827').text(data.foodAdvice, 40, y);
      y += 20;
    }
    if (data.followUpDate) {
      if (y > 650) { doc.addPage(); y = 40; }
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#dc2626').text('Follow-up:', 40, y);
      doc.fontSize(11).font('Helvetica').fillColor('#111827').text(
        new Date(data.followUpDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        130, y
      );
      y += 30;
    }

    const sigY = Math.max(y, 630);
    tryImage(data.doctor.signatureImg, 380, sigY, 120);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111827')
      .text(`Dr. ${data.doctor.fullName}`, 380, sigY + 40, { align: 'right' });
    doc.fontSize(9).font('Helvetica').fillColor(gray)
      .text((data.doctor.degree || []).join(', '), 380, sigY + 54, { align: 'right' })
      .text(`BMDC: ${data.doctor.bmdcRegNo}`, 380, sigY + 67, { align: 'right' });

    QRCode.toBuffer(JSON.stringify({ rxNo: data.prescriptionNo, doctor: data.doctor.fullName, patient: data.patient.fullName }), { width: 100, margin: 1 })
      .then((qr) => { doc.image(qr, 430, 40, { width: 70 }); doc.end(); })
      .catch(() => doc.end());
  });
};
