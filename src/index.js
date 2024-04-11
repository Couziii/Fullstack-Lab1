import express from "express";
import dotenv from "dotenv";
import {dirname, sep} from "path";
import { fileURLToPath } from "url";
import recipeRouter from "./routes/recipeRouter.js";
import compression from "compression";

// require("dotenv").config();
dotenv.config();


const __dirname = dirname(fileURLToPath( import.meta.url )) + sep;
const cfg = {
        port: process.env.PORT || 3000,
        dir: {
            root: __dirname,
            views: __dirname + "views" + sep,
            static: __dirname + "static" + sep
        }

}


console.dir(cfg, {depth: null, color: true});
const app = express();

// pretty print
app.set('json spaces', 2)
app.use(express.json());



app.set('view engine', 'ejs');
app.set('views', cfg.dir.views)

app.use(express.urlencoded({ extended:true }))
app.use( compression() );

app.use('/api', recipeRouter);


app.use(express.static(cfg.dir.static));

app.get('/', (req, res) => {
    // res.sendFile(cfg.dir.static + "index.html")
    res.render('table', {
        title: "WORK",
        data: {cow: "moo"}
    });
})


app.listen(cfg.port, () => {
    console.log(`Running on port ${ cfg.port }.`)
})