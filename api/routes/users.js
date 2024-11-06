const express = require("express");
const router = express.Router();
const { saveUser,getUserById, updateUser, deleteUser, getUser } = require('../../controllers/userController');

router.get("/", getUser);

router.get("/:id",getUserById);

router.post('/submitform', saveUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
