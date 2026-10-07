const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Non-blocking stream approach
    const stream = fs.createReadStream('largefile.txt', 'utf8');
    
    // Send 200 OK headers only when data successfully starts flowing
    stream.on('open', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        console.log(`[${new Date().toLocaleTimeString()}] Serving file asynchronously...`);
        stream.pipe(res);
    });
    
    // Handle errors (like missing files) smoothly without crashing the server
    stream.on('error', (err) => {
        console.error("Terminal Error:", err.message);
        
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error: Make sure largefile.txt exists in this folder.');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running! Open browser: http://localhost:${PORT}`);
    console.log('Press Ctrl + C in terminal to stop.');
});
