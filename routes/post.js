const express = require ('express');
const router = express.Router();

const postControllers = require('../controllers/post_controllers');


router.get('/User_post' ,postControllers.post);
module.exports = router;