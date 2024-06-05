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
            href: `http://localhost:3000/api/v2/guitarras/${item.id}`,
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

app.get("/api/v2/guitarra", (req, res) => {
    const { values } = req.query;
    if (values === "asc" || values === "desc") {
        res.send(orderValues(values));
    } else {
        return res.status(400).send("Parámetro no válido");
    }
});

const fieldSelect = (guitarra, fields) => {
    for (let prop in guitarra) {
        if (!fields.includes(prop)) delete guitarra[prop];
    }
    return guitarra;
};

app.get("/api/v2/guitarra/:id", (req, res) => {
    const { id } = req.params;
    const { fields } = req.query;

    if (fields) return res.send({ guitarra: fieldSelect(guitarra(id), fields.split(",")) });

    res.send({
        guitarra: guitarra(id),
    });
});

const hateoasv2 = (guitarras) => {
    return guitarras.map((item) => {
        return {
            name: item.name,
            href: `http://localhost:3000/api/v2/guitarras/${item.id}`,
        };
    });
};

app.get("/api/v2/guitar", (req, res) => {
    const { values } = req.query;

    if (values == "asc") return res.send(orderValues("asc"));
    if (values == "desc") return res.send(orderValues("desc"));

    if (req.query.page) {
        const { page } = req.query;

        return res.send({ guitarras: hateoasv2(guitarras).slice(page * 2 - 2, page * 2) });
    }
    res.send({
        guitarras: hateoasv2(guitarras),
    });
});

app.listen(3000, () => console.log("Servidor encendido!", `http://localhost:3000`));
