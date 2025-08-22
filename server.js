import express from "express";
import { Rendertron } from "rendertron";

const app = express();
const PORT = process.env.PORT || 10000;

// health check
app.get("/", (_req, res) => res.send(`OK prerender proxy on ${PORT}`));

// main prerender endpoint
app.get("/render/*", async (req, res) => {
  const target = req.params[0];
  if (!/^https?:\/\//i.test(target)) {
    return res.status(400).send("Provide absolute URL after /render/");
  }

  const ua = req.headers["user-agent"] || "Mozilla/5.0 (RenderProxy)";
  try {
    const rt = new Rendertron({ timeout: 15000 });
    const html = await rt.serialize(target, ua);
    res.set("content-type", "text/html; charset=utf-8").send(html);
  } catch (e) {
    console.error("Render error:", e.message);
    res.status(502).send("Render failed");
  }
});

app.listen(PORT, () => console.log(`PRERENDER proxy listening on ${PORT}`));
