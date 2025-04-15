import { serve } from "bun";
import path from "path";

const server = serve({
    port: 3010,
    fetch(req) {
        const url = new URL(req.url);
        let filePath = url.pathname;
        
        // Default to index.html
        if (filePath === '/') {
            filePath = '/index.html';
        }

        // Remove leading slash
        filePath = filePath.replace(/^\//, '');

        // Handle different file paths
        if (filePath === 'index.html') {
            filePath = 'test/index.html';
        } else if (filePath.startsWith('dist/')) {
            filePath = path.join(process.cwd(), filePath);
        } else {
            filePath = path.join(process.cwd(), 'test', filePath);
        }

        try {
            const file = Bun.file(filePath);
            if (!file.exists()) {
                console.error(`File not found: ${filePath}`);
                return new Response('Not Found', { status: 404 });
            }

            // Set appropriate content type
            const contentType = filePath.endsWith('.js') ? 'application/javascript' :
                              filePath.endsWith('.html') ? 'text/html' :
                              'text/plain';

            return new Response(file, {
                headers: {
                    'Content-Type': contentType
                }
            });
        } catch (error) {
            console.error(`Error serving ${filePath}:`, error);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
});

console.log(`Server running at http://localhost:${server.port}`); 