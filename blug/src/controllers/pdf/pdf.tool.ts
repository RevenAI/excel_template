import { StudentIDCardService } from "./student-idcard.service.js"; 

const pdfPath = "src/controllers/student-idcard/student_id_card.pdf";

export async function generateStudentIDCard() {
  const idCardService = new StudentIDCardService();

  const pdfBuffer = await idCardService.generateIdCard(
    await idCardService.getDummyStudentIdCardData(),
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


