import express from "express";
import guitarras from "./data/guitarras.js";

const app = express();

app.use(express.static("public"));

app.get("/api/v2", async (req, res) => {
    res.send(guitarras);
});

const hateoas = (guitarras) => {
    return guitarras.map((item) => {
        return {
            name: item.name,
            href: `http://localhost:3000/guitarra/${item.id}`,
        };
    });
};

app.get("/api/v2/guitarras", (req, res) => {
    res.json({ guitarras: hateoas(guitarras) });
});

const guitarra = (id) => {
    return guitarras.find((item) => item.id === +id);
};

app.get("/api/v2/guitarras/:id", (req, res) => {
    const { id } = req.params;

    const guitar = guitarra(id);

    if (guitar) {
        res.json(guitar);
    } else {
        res.json({ msg: "guitarra no encontrada" }).status(404);
    }
});

const filtroByBody = (body) => {
    return guitarras.filter((item) => item.body === body);
};

app.get("/api/v2/body/:cuerpo", (req, res) => {
    const { cuerpo } = req.params;
    res.send({
        cant: filtroByBody(cuerpo).length,
        guitarras: filtroByBody(cuerpo),
    });
});

const orderValues = (order) => {
    return order === "asc"
        ? guitarras.sort((a, b) => a.value - b.value)
        : order === "desc"
        ? guitarras.sort((a, b) => b.value - a.value)
        : false;
};

app.get("/api/v2/guitarras/:value", (req, res) => {});

app.listen(3000, () => console.log("Servidor encendido!", `http://localhost:3000`));
