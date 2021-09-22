/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 02-08-2021
 * @modify date 22-09-2021
 * @desc [CRUD Controller]
 */
require("dotenv").config();
const mysql = require("mysql");
const nodecache = require("node-cache");
const { hash } = require("bcrypt");
const {
  validateInsert,
  validateUpdate,
  validateUserID,
} = require("../helpers/validations");

const mycache = new nodecache({ stdTTL: 60 });

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const index = {
  addUser: async (req, res, next) => {
    const { error } = validateInsert(req.body);
    if (error) return next(error);

    const params = req.body;
    /* hashing Password */
    const hasedPass = await hash(params.password, 16);

    pool.getConnection((err, connection) => {
      if (err)
        return next(
          err.message.includes("ECONNREFUSED")
            ? new Error("Could not connect to database")
            : err
        );

      /* Check Email is exists */
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [params.email],
        (err, rows) => {
          if (!err) {
            if (rows.length > 0)
              return next(new Error("⛔ Email ID already exists"));

            /* Check Username is exists */
            connection.query(
              "SELECT * FROM users WHERE username = ?",
              [params.username],
              (err, rows) => {
                if (!err) {
                  if (rows.length > 0)
                    return next(new Error("⛔ Username already in use"));

                  /* Inserting User props */
                  connection.query(
                    "INSERT INTO users (fullname,username,email,password,ip_address,user_agent) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                      params.fullname,
                      params.username,
                      params.email,
                      hasedPass,
                      req.ip,
                      req.get("User-Agent"),
                    ],
                    (err, rows) => {
                      connection.release();
                      if (!err) {
                        res.status(200).json({
                          status: 200,
                          response: "🆗",
                          response: "User Added Successfully",
                        });
                      } else {
                        next(err);
                      }
                    }
                  );
                } else {
                  next(err);
                }
              }
            );
          } else {
            next(err);
          }
        }
      );
    });
  },
  getallUsers: (req, res, next) => {
    try {
      if (mycache.has("databaseCache")) {
        res.status(200).json({
          status: 200,
          response: mycache.get("databaseCache"),
        });
      } else {
        pool.getConnection((err, connection) => {
          if (err)
            return next(
              err.message.includes("ECONNREFUSED")
                ? new Error("Could not connect to database")
                : err
            );
          /* console.log("connected as id " + connection.threadId); */
          connection.query(
            "SELECT id,fullname,username,email,ip_address,user_agent from users",
            (err, users) => {
              connection.release(); // return the connection to pool
              if (!err) {
                mycache.set("databaseCache", users);
                res.status(200).json({
                  status: 200,
                  response: "🆗",
                  response: users,
                });
              } else {
                next(err);
              }
            }
          );
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getOneUser: (req, res, next) => {
    const { error } = validateUserID(req.params);
    if (error) return next(error);

    const { id } = req.params;
    pool.getConnection((err, connection) => {
      if (err)
        return next(
          err.message.includes("ECONNREFUSED")
            ? new Error("Could not connect to database")
            : err
        );

      connection.query(
        "SELECT id,fullname,username,email,ip_address,user_agent FROM users WHERE id = ?",
        id,
        (err, row) => {
          connection.release();
          if (!err) {
            if (row.length > 0) {
              res.status(200).json({
                status: 200,
                response: "🆗",
                response: row,
              });
            } else {
              next(new Error(`User with ID: ${id} is not found`));
            }
          } else {
            next(err);
          }
        }
      );
    });
  },
  updateUser: (req, res, next) => {
    const { error } = validateUpdate(req.body);
    if (error) return next(error);

    const { error: err } = validateUserID(req.params);
    if (err) return next(err);

    var { fullname, username, email } = req.body;
    const { id } = req.params;

    pool.getConnection((err, connection) => {
      if (err)
        return next(
          err.message.includes("ECONNREFUSED")
            ? new Error("Could not connect to database")
            : err
        );

      /* Check User exists */
      connection.query("SELECT * FROM users WHERE id = ?", id, (err, rows) => {
        if (!err) {
          if (rows.length === 0)
            return next(new Error(`User with ID: ${id} is not found`));

          fullname == null ? (fullname = rows[0].fullname) : fullname;
          username == null ? (username = rows[0].username) : username;
          email == null ? (email = rows[0].email) : email;

          connection.query(
            "UPDATE users SET fullname = ?, username = ?, email = ? WHERE id = ?",
            [fullname, username, email, req.params.id],
            (err, rows) => {
              if (!err) {
                connection.release();
                res.status(200).json({
                  status: 200,
                  response: "🆗",
                  response: `User with the record ID: ${req.params.id} has been updated`,
                });
              } else {
                next(err);
              }
            }
          );
        } else {
          next(err);
        }
      });
    });
  },
  deleteUser: (req, res, next) => {
    const { error } = validateUserID(req.params);
    if (error) return next(error);

    const { id } = req.params;

    pool.getConnection((err, connection) => {
      if (err)
        return next(
          err.message.includes("ECONNREFUSED")
            ? new Error("Could not connect to database")
            : err
        );
      /* Check User exists */
      connection.query("SELECT * FROM users WHERE id = ?", id, (err, rows) => {
        if (!err) {
          //return res.status(200).jsonp(rows);
          if (rows.length === 0)
            return next(new Error(`User with ID: ${id} is not found`));

          connection.query(
            "DELETE FROM users WHERE id = ?",
            id,
            (err, rows) => {
              if (!err) {
                connection.release();
                res.status(200).json({
                  status: 200,
                  response: "🆗",
                  response: `User with the record ID: ${req.params.id} has been removed`,
                });
              } else {
                next(err);
              }
            }
          );
        } else {
          next(err);
        }
      });
    });
  },
};

module.exports = index;
