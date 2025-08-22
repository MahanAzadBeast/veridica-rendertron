import express from "express";
import { Rendertron } from "rendertron";

const app = express();

// Bind ONLY to the port Render provides
const PORT = process.env.PORT; // no fallback

// Health
app.get("/", (_req, res) => res.status(200).send(`OK prerender proxy on ${PORT}`));

// /render/<absolute-url>
app.get("/render/*", async (req, res) => {
  const target = req.params[0];
  if (!/^https?:\/\//i.test(target)) return res.status(400).send("Provide absolute URL after /render/");

  try {
    const rt = new Rendertron({ timeout: 15000 });
    const ua = req.headers["user-agent"] || "Mozilla/5.0 (compatible; Veridica-RenderProxy/1.0)";
    const html = await rt.serialize(target, ua);
    res.set("content-type", "text/html; charset=utf-8").status(200).send(html);
  } catch (e) {
    console.error("Render error:", e?.message || e);
    res.status(502).send("Render failed");
  }
});

// *** Single-start guard ***
// If something causes this file to be evaluated twice, we still bind only once.
if (!globalThis.__PRERENDER_LISTENING__) {
  app.listen(PORT, () => console.log(`✅ PRERENDER proxy listening on ${PORT}`));
  globalThis.__PRERENDER_LISTENING__ = true;
}
