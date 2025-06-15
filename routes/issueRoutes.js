const express = require("express");
const router = express.Router();
const { createIssue } = require("../controllers/admin/issueAdminController");
router.post("/", createIssue);
module.exports = router;
