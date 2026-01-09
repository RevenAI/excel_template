import { ServerResponse } from "http";
import fs from "node:fs/promises"

export async function serveHtml(res: ServerResponse, filePath: string) {
    try {
       const data = await fs.readFile(filePath, "utf8");
      res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });

    res.end(data);
    } catch(error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
      return;
    }
}