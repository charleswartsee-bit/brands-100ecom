import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy route for the webhook to bypass CORS
  app.post("/api/submit", async (req, res) => {
    const WEBHOOK_URL = 'https://hook.us2.make.com/grrf2kjck8yz62dlhvwjwnxj69os41';
    
    try {
      console.log('--- Webhook Proxy Start ---');
      console.log('Forwarding to:', WEBHOOK_URL);
      console.log('Payload:', JSON.stringify(req.body, null, 2));
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const responseText = await response.text();
      console.log(`Make.com responded with status: ${response.status}`);
      console.log(`Make.com response body: ${responseText}`);
      console.log('--- Webhook Proxy End ---');
      
      // We return 200 to the client as long as we successfully communicated with the webhook
      // even if the webhook returned an error status (like 400 or 500)
      res.status(200).json({ 
        success: true, 
        webhookStatus: response.status,
        webhookResponse: responseText 
      });
    } catch (error) {
      console.error('--- Webhook Proxy ERROR ---');
      console.error('Error forwarding to Make.com:', error);
      res.status(500).json({ 
        error: 'Failed to forward to webhook',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
