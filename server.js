import express from "express";
import router from "./routes/review-order.js";
import path from "path";
import config from "./config.js";
import fs from "fs";
import glob from "glob";

var language_dict = {};
const app = express();

var __dirname = path.resolve();
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));
app.use("/", router);
const listen = () => {
  app.listen(config.PORT, () => {
    console.log(`Listening at ${config.HOST}:${config.PORT}`);
  });
};

glob.sync("./language/*.json").forEach(function (file) {
  let dash = file.split("/");
  if (dash.length == 3) {
    let dot = dash[2].split(".");
    if (dot.length == 2) {
      let lang = dot[0];
      fs.readFile(file, function (err, data) {
        language_dict[lang] = JSON.parse(data.toString());
      });
    }
  }
});
export { listen };
