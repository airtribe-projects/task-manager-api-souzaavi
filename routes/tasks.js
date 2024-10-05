const express = require("express");
const {
  createTask,
  retrieveTasks,
  retrieveTaskById,
  modifyTaskById,
  deleteTaskById,
  retrieveTasksByPriority,
} = require('../controllers/tasks');
const validateId = require("../middleware/validate_id");
const router = express.Router();


/**
 * Create a new task.
 *
 * @route POST /tasks
 * @controller createTask: Controller responsible for creating a task and
 * return newly created task object to the client
 *
 */
router.post('/', createTask);


/**
 * Retrieve tasks by priority level.
 *
 * @route GET /tasks/priority/:level
 * @controller retrieveTasksByPriority: Responsible to retrieve a list of
 * tasks by its priority
 * @param {string} level - The priority level of the tasks to retrieve. It
 * can be either low, medium or high
 *
 */
router.get('/priority/:level', retrieveTasksByPriority);


/**
 * Retrieve all tasks.
 *
 * @route GET /tasks
 * @controller retrieveTasks: Responsible to retrieve a list of task.
 * Optionally It will filter the tasks based on the completed status,
 * creation date and sorts based on the creation date or by the id.
 * By default it will sort by id in ascending order.
 *
 */
router.get('/', retrieveTasks);


/**
 * Retrieve a task by ID.
 *
 * @route GET /tasks/:id
 * @param {Object} req - The Express request object.
 * @param {string} req.params.id - The ID of the task to retrieve.
 * @middleware validateIs: Middleware responsible to validate the id.
 * @controller retrieveTaskById: Controller responsible to retrieve task
 * based on task id.
 *
 */
router.get('/:id', validateId, retrieveTaskById);


/**
 * Update a task by ID.
 *
 * @route PUT /tasks/:id
 * @param {string} req.params.id - The ID of the task to update.
 * @middleware validateId: Middleware responsible to validate the id.
 * @controller modifyTaskById: Controller responsible to update task
 * based on task id.
 *
 */
router.put('/:id', validateId, modifyTaskById);


/**
 * Delete a task by ID.
 *
 * @route DELETE /tasks/:id
 * @param {string} req.params.id - The ID of the task to delete.
 * @middleware validateId: Middleware responsible to validate the id.
 * @controller modifyTaskById: Controller responsible to delete task
 * based on task id.
 *
 */
router.delete('/:id', validateId, deleteTaskById);

module.exports = router;
