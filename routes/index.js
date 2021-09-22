/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 02-08-2021
 * @modify date 21-09-2021
 * @desc [Routes]
 */

const router = require("express").Router();
const index = require("../controllers/crudController");

/* GET All Users. */
router.get("/", index.getallUsers);

/* Adding a User */
router.post("/addUser", index.addUser);

/* get One User */
router.get("/getUser/:id", index.getOneUser);

/* update User */
router.patch("/updateUser/:id", index.updateUser);

/* delete User */
router.delete("/deleteUser/:id", index.deleteUser);

module.exports = router;
