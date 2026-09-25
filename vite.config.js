import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'resolve-map-proxy',
      configureServer(server) {
        server.middlewares.use('/api/resolve-map', async (req, res) => {
          try {
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const targetUrl = urlObj.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing url param' }));
              return;
            }
            const fetchRes = await fetch(targetUrl, {
              redirect: 'follow',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const finalUrl = fetchRes.url;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ finalUrl }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      }
    }
  ],
})
