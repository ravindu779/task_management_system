const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate); 

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/pdf', taskController.generatePDF);


module.exports = router;