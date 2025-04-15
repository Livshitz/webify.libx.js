import { serve } from "bun";
import { join } from "path";
import { file } from "bun";

const server = serve({
    port: 3010,
    async fetch(req) {
        const url = new URL(req.url);
        let path = url.pathname;
        
        // Default to index.html
        if (path === "/") {
            path = "/test/require-test.html";
        }

        // Remove leading slash and resolve path
        const filePath = join(process.cwd(), path.substring(1));
        
        try {
            const f = file(filePath);
            return new Response(f);
        } catch (e) {
            return new Response("Not found", { status: 404 });
        }
    },
});

console.log(`Server running at http://localhost:${server.port}`); 