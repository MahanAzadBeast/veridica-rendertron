import express from "express";
import { Rendertron } from "rendertron";

const app = express();

// Render gives you a unique port in process.env.PORT
const PORT = process.env.PORT || 3000;

// Simple root health check
app.get("/", (_req, res) => {
  res.status(200).send(`OK prerender proxy on ${PORT}`);
});

// Proxy to Rendertron
app.get("/render/*", async (req, res) => {
  const target = req.params[0];
  if (!/^https?:\/\//i.test(target)) {
    return res.status(400).send("Provide absolute URL after /render/");
  }
  try {
    const rt = new Rendertron({ timeout: 15000 });
    const ua = "Mozilla/5.0 (compatible; Veridica-RenderProxy/1.0)";
    const html = await rt.serialize(target, ua);
    res.set("content-type", "text/html; charset=utf-8").send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Rendertron failed");
  }
});

app.listen(PORT, () => {
  console.log(`✅ PRERENDER proxy listening on ${PORT}`);
});
