import express from "express";
import path from "path";
import { executeNonQuery, selectRecordFromDB } from "../utils/data-service.js";
import fs from "fs";
import glob from "glob";
import { upload } from "../routes/middleware.js";

const router = express.Router();
var __dirname = path.resolve();
var language_dict = {};

/**
 * @function
 * this function takes the json format file for language conversion as input.
 */
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

/**
 * Endpoint
 * Localhost:3000/
 * renders the form page when the url is hit.
 */
router.get("/", (req, res) => {
  const lang = req.query.lang;
  const store_id = req.query.store_id;
  const order = req.query.order;
  selectRecordFromDB(`Select p.product_id, p.product_name, p.product_size, p.allow_resubmit from "Products" p inner join "Orders" o on o.product_id = p.product_id
  Where o.order_id = '${order}' AND o.store_id = '${store_id}'`).then(
    (data) => {
      if (lang !== "" && language_dict.hasOwnProperty(lang)) {
        res.render("index", {
          products: data.rows,
          language: language_dict[lang],
        });
      } else {
        res.send("<h1>There is some problem in your url</h1>");
      }
    }
  );
});

/**
 * Endpoint reviewOrders
 * Localhost:3000/reviewOrders
 * This end point takes the review form attributes data in the body from the front end and stores it in the data base.
 */
router.post("/reviewOrders", upload.single("File"), (req, res) => {
  let queries = [];
  let img = req.body.Image_Url;
  if (img) {
    img = `/uploads/${img}`;
  }
  queries.push({
    text: 'INSERT INTO "tblReviews"("Store_id","Order_id","Display_userName","Product_id","Star_rating","Comments","Is_cm","Fit","Height","Weight","ItemSize","Meas1","Meas2","Meas3", "Image_Url")VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
    values: [
      req.body.Store_id,
      req.body.Order_id,
      req.body.Display_userName,
      req.body.Product_id,
      req.body.Star_rating,
      req.body.Comments,
      req.body.Is_cm,
      req.body.Fit,
      req.body.Height,
      req.body.Weight,
      req.body.ItemSize,
      req.body.Meas1,
      req.body.Meas2,
      req.body.Meas3,
      img,
    ],
  });
  queries.push({
    text: `update "Products" set allow_resubmit= '1' where product_id = $1`,
    values: [req.body.Product_id],
  });
  executeNonQuery(queries)
    .then((r) => {
      res.json({
        operationStatus: 1,
      });
    })
    .catch((error) => {
      res.sendStatus(500);
      res.json({ operationStatus: 0 });
    });
});

export default router;
