import PDFDocument from "pdfkit";

export const generateReceiptPdf = (payment, student, announcement) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Krishnanagar Government College", { align: "center" });
    doc
      .fontSize(16)
      .font("Helvetica")
      .text("Payment Receipt", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).font("Helvetica-Bold");
    doc
      .text(`Transaction ID: `, { continued: true })
      .font("Helvetica")
      .text(payment.transactionId);
    doc
      .text(`Payment Date: `, { continued: true })
      .font("Helvetica")
      .text(new Date(payment.createdAt).toLocaleDateString("en-IN"));
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold").text("Paid By:");
    doc.font("Helvetica").text(student.name);
    doc.text(student.email);
    doc.text(`Enrollment No: ${student.enrollment}`);
    doc.moveDown(2);

    doc.font("Helvetica-Bold").text("Description", 100, 300);
    doc.text("Amount (INR)", 400, 300, { align: "right" });
    doc.moveTo(50, 320).lineTo(550, 320).stroke(); // Underline

    doc.font("Helvetica").text(announcement.title, 100, 330);
    doc.text(`₹ ${announcement.amount.toFixed(2)}`, 400, 330, {
      align: "right",
    });
    doc.moveTo(50, 350).lineTo(550, 350).stroke(); // Underline
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Total Paid", 100, 360);
    doc.text(`₹ ${announcement.amount.toFixed(2)}`, 400, 360, {
      align: "right",
    });
    doc.moveDown(3);

    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text(
        "This is a computer-generated receipt and does not require a signature.",
        { align: "center" }
      );

    doc.end();
  });
};
