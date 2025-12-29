import http from "http";
const PORT = 3500;
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running");
});
console.log('This is working fine!');
server.listen(PORT, () => {
    console.log(`[APP ENTRY] Server running on port ${PORT}`);
});
