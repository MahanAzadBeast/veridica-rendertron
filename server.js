import express from "express";
import { Rendertron } from "rendertron";

const app = express();
const port = process.env.PORT || 3000;
const SECRET = process.env.PRERENDER_SECRET || "CHANGE_ME";

// Health
app.get("/", (_, res) => res.status(200).send("OK - Rendertron proxy running"));

// Prerender endpoint
app.get("/render/*", async (req, res) => {
  const target = req.params[0]; // absolute URL after /render/
  if (!/^https?:\/\//i.test(target)) return res.status(400).send("Missing absolute URL");

  try {
    const rt = new Rendertron({ timeout: 15000 });
    // Spoof headers so Cloudflare lets us in
    const ua = req.headers["user-agent"] || "Mozilla/5.0 (compatible; Rendertron)";
    const headers = {
      "User-Agent": ua,
      "X-Prerender-Token": SECRET
    };
    // Rendertron.serialize accepts headers via options in v3.1 using request override
    const html = await rt.serialize(target, ua, { headers });
    res.set("content-type", "text/html; charset=utf-8").send(html);
  } catch (e) {
    res.status(502).send("Render failed");
  }
});

app.listen(port, () => console.log(`Rendertron proxy on ${port}`));
