import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => res.status(200).send(`OK minimal on ${PORT}`));

app.listen(PORT, () => console.log(`MINIMAL listening on ${PORT}`));
