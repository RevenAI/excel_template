// src/services/QRCodeService.ts
import QRCode from "qrcode";

/**
 * QRCodeService
 *  THIS SERVICE USE THE npm qrcode LIBRARY
 * A reusable service to generate QR codes for any data payload.
 * Returns QR codes as Base64 data URLs, ready to embed in HTML <img> tags.
 */
export class QRCodeService {
  /**
   * Generates a QR code as a PNG data URL from any JSON-serializable payload
   * @param data Any object or string to encode in QR
   * @param size Optional size in pixels (default 150)
   * @param margin Optional margin (default 1)
   * @returns Promise<string> Data URL ("data:image/png;base64,...")
   */
  static async generateDataURL(
    data: any,
    size: number = 150,
    margin: number = 1
  ): Promise<string> {
    const payload = typeof data === "string" ? data : JSON.stringify(data);

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: "H", // high level error correction
        type: "image/png",
        width: size,
        margin,
      });
      return dataUrl;
    } catch (err) {
      console.error("QRCode generation error:", err);
      throw new Error("Failed to generate QR code");
    }
  }

  /**
   * Generates a QR code and returns as a raw buffer (optional)
   * Useful if you want to save to file instead of embedding in HTML
   * @param data Any object or string
   * @param size Optional size in pixels (default 150)
   * @returns Promise<Buffer>
   */
  static async generateBuffer(data: any, size: number = 150): Promise<Buffer> {
    const payload = typeof data === "string" ? data : JSON.stringify(data);

    try {
      const buffer = await QRCode.toBuffer(payload, {
        errorCorrectionLevel: "H",
        type: "png",
        width: size,
      });
      return buffer;
    } catch (err) {
      console.error("QRCode buffer generation error:", err);
      throw new Error("Failed to generate QR code buffer");
    }
  }
}
