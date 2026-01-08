import { StudentIDCardService } from "./student-idcard.service.js"; 

const pdfPath = "src/controllers/student-idcard/student_id_card.pdf";

export async function generateStudentIDCard() {
  const idCardService = new StudentIDCardService();

  const pdfBuffer = await idCardService.generateIdCard(
    idCardService.dummyStudentIdCardData,
    pdfPath
  );

  console.log("ID card PDF buffer size:", pdfBuffer.length);

  return {
    pdfBuffer,

    /** return the current instance so that the caller can close it after use.
     *  For example; await idCardService.close() 
     * */
    idCardService,
  }
  
}



// import { PuppeteerService } from "./puppeteer.service.js";
// import { testQR } from "../qr/test.js"; 
// import fs from "node:fs/promises"
// import path from "node:path";

// export interface StudentIdCardData {
//     //student info
//     _id: string
//     fullName: string
//     email: string

//     //school info
//     schoolName: string
//     motto: string
//     address: string

//     //card specific info
//     dateIssue: string | Date
//     dateDue: string | Date

//   };
  
// const pdfPath = "src/controllers/qr-image/student_id_card.pdf";
// const pdfDif = path.dirname(pdfPath)

// export async function generateStudentIdCard(data: StudentIdCardData, html: string) {
//     try {
//          const puppeteerService = new PuppeteerService();

//   // Generate QR code for student
//   const { qrDataUrl } = await testQR({ _id: data._id, email: data.email, fullName: data.fullName });

//   // HTML template
//   const html = `
//     <div style="width:350px;height:200px;border:2px solid #333;padding:16px;font-family:sans-serif;position:relative;">
//       <h2 style="margin:0;color:#007bff;">${student.fullName}</h2>
//       <p style="margin:4px 0;">Email: ${student.email}</p>
//       <img src="${qrDataUrl}" style="position:absolute;bottom:16px;right:16px;width:80px;height:80px;" />
//     </div>
//   `;

//   const pdfBuffer = await puppeteerService.renderPdf({
//     html,
//     width: "350px",
//     height: "200px",
//     printBackground: true,
//   });

//       try {
//       await fs.access(pdfPath, fs.constants.F_OK);
//     } catch {
//       await fs.mkdir(pdfPath, { recursive: true })
//     }
//   await fs.writeFile("student-id.pdf", pdfBuffer);
//   console.log("PDF generated: student-id.pdf");

//   await puppeteerService.closeBrowser();

//     } catch(error) {
//         throw error
//     }
// }

