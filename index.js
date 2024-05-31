import express from "express";
import guitarras from "./data/guitarras.js";

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
    console.log(guitarras);
    res.send(guitarras);
});

app.listen(3000, () => console.log("Servidor encendido!"));
