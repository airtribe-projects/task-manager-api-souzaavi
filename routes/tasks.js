const express = require("express");
const {
  createTask,
  retrieveTasks,
  retrieveTaskById,
  modifyTaskById,
  deleteTaskById,
  retrieveTasksByPriority,
} = require('../controllers/tasks');
const router = express.Router();


router.post('', createTask);

router.get('/priority/:level', retrieveTasksByPriority);

router.get('', retrieveTasks);

router.get('/:id', retrieveTaskById);

router.put('/:id', modifyTaskById);

router.delete('/:id', deleteTaskById);

module.exports = router;