import pkg from "pg";
import config from "../config.js";
const { Client } = pkg;

const pool = new pkg.Pool({
  host: config.DBHOST,
  user: config.DBUSERNAME,
  password: "l1f16bscs0376",
  database: config.DB,
  port: config.DBPORT,
});
const shouldAbort = (client, err) => {
  if (err) {
    console.error("Error in transaction", err.stack);
    client.query("ROLLBACK", (err) => {
      if (err) {
        console.error("Error rolling back client", err.stack);
      }
      // release the client back to the pool
      done();
    });
  }
  return !!err;
};
/**
 * this function accept multiple queries for db
 * @param {queries} it will accept an array of queries implement transaction on it and rollback if any error occurs
 * @returns promise of success/failure
 */
let executeNonQuery = (queries) => {
  return new Promise(async (resolve, reject) => {
    pool.connect(function (err, client, done) {
      client.query("BEGIN", (err) => {
        if (shouldAbort(client, err)) {
          reject(err);
          return;
        }
        client.query(queries[0].text, queries[0].values, (err, res) => {
          if (shouldAbort(client, err)) {
            reject(err);
            return;
          }
          client.query(queries[1].text, queries[1].values, (err, res) => {
            if (shouldAbort(client, err)) {
              reject(err);
              return;
            }
            client.query("COMMIT", (err) => {
              if (err) {
                reject(err);
              }
              done();
              resolve("response returned successfully");
            });
          });
        });
      });
    });
  });
};

/**
 * this function inserts the query into db
 * @param {text} text
 * @param {Values} values
 * @returns promise of inserted query values
 */
let executeNonQueryUpdate = (text) => {
  let query = {
    text,
  };
  return new Promise((resolve, reject) => {
    pool.connect(function (err, client, done) {
      if (err) {
        return console.error("connection error", err);
      }
      client.query(query.text, function (err, result) {
        // call `done()` to release the client back to the pool
        done();
        console.log("response : " + result);
        resolve("response returned successfully");
        if (err) {
          reject(err);
          console.error("error running query", err);
        }
      });
    });
  });
};
/**
 * this function finds the query from db
 * @param {query} query
 * @returns promise of inserted query values
 */
let selectRecordFromDB = (query) => {
  return new Promise((resolve, reject) => {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error("connection error", err);
        reject(err);
      }
      client.query(query, function (err, result) {
        done();
        resolve(result);
        if (err) {
          console.error("error running query", err);
          reject(err);
        }
      });
    });
  });
};
export { executeNonQuery, selectRecordFromDB, executeNonQueryUpdate };
