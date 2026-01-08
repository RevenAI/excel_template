

qrcode
 – simplest, supports generating buffers, base64, or data URLs.

qr-image
 – generates PNG or SVG streams.

bwip-js
 – supports QR + barcodes.

to decode an image
 - use qrcode or a QR reader library (qrcode-reader, jsqr, qr-scanner)

# Example Reading/Scanning QR
import fs from 'fs';
import Jimp from 'jimp';
import QrCode from 'qrcode-reader';

const buffer = fs.readFileSync('student_qr.png');

Jimp.read(buffer, (err, image) => {
  if (err) throw err;

  const qr = new QrCode();
  qr.callback = (err, value) => {
    if (err) throw err;
    console.log('Decoded QR:', value.result);

    const student = JSON.parse(value.result);
    console.log(student._id, student.email);
  };

  qr.decode(image.bitmap);
});
