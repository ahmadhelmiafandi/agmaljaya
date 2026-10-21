import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'api-proxy-handlers',
      configureServer(server) {
        // Handler untuk /api/resolve-map
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

        // Handler untuk /api/chat (Konsultan AI Agmal Assistant)
        server.middlewares.use('/api/chat', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }
          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                req.body = JSON.parse(bodyStr || '{}');
              } catch (e) {
                req.body = {};
              }
              if (!res.status) {
                res.status = (code) => { res.statusCode = code; return res; };
              }
              if (!res.json) {
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };
              }
              try {
                const { default: handler } = await import('./api/chat.js');
                await handler(req, res);
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
          }
        });
      }
    }
  ],
})
