const {
  findAll,
  findById,
  writeTasks,
  updateTaskById,
  deleteTask
} = require("../services/taskService");

const {
  fields,
  priorities,
  sortOrders,
  allowedCompletionValues,
} = require('../constants/filer_contstants');

const validateField = require("../helpers/validation");



/**
 * Retrieve a list of tasks based on query parameters.
 *
 * @route GET /tasks
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.completed] - Optional filter for task completion status ('true' or 'false').
 * @param {string} [req.query.field=id] - Optional field to sort by ('id' or 'createdAt').
 * @param {string} [req.query.asc=true] - Optional sort order ('true' for ascending, 'false' for descending).
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @throws {Error} If invalid values are provided for 'completed', 'field', or 'asc'.
 *
 * @returns {Promise<void>} Sends a JSON response with the retrieved tasks.
 */
const retrieveTasks = async (req, res, next) => {
  try {
    const {completed} = req.query;
    let {field = 'id', asc = 'true'} = req.query;

    if(completed && !(allowedCompletionValues.includes(completed))) {
      return next(
        new Error('Invalid Input: completed can only have true or false values')
      );
    }

    if(!sortOrders.includes(asc)) {
      return next(
        new Error('Invalid Input: asc can only have true or false values')
      );
    }

    if(!fields.includes(field)) {
      return next(
        new Error(`Invalid Input: field can only have ${fields}`)
      );
    }

    const {tasks} = await findAll({completed: completed}, {field, asc: asc === 'true',});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}


/**
 * Retrieve a single tasks based on id parameter.
 *
 * @route GET /tasks/:id
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The query parameters.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @throws {Error} If invalid values for id is provided, Valid id is a
 * positive integer
 *
 * @returns {Promise<void>} Sends a JSON response with the retrieved task.
 */
const retrieveTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const task = await findById(parseInt(id));
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    next(error);
  }
}


/**
 * Create a new task.
 *
 * @route POST /tasks
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing task details.
 * @param {string} req.body.title - The title of the task (required).
 * @param {string} req.body.description - The description of the task (required).
 * @param {boolean} [req.body.completed=false] - Optional completion status of the task (defaults to false).
 * @param {string} [req.body.priority=low] - Optional priority of the task ('low', 'medium', 'high', defaults to 'low').
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @throws {Error} If 'title' or 'description' are missing or invalid, or if 'completed' or 'priority' have incorrect types or values.
 *
 * @returns {Promise<void>} Sends a JSON response to the client with the created task.
 *
 */
const createTask = async (req, res, next) => {
  try {
    const {title, description, completed, priority} = req.body;
    validateField(title, "Title");
    validateField(description, "Description");
    if (completed !== undefined && typeof completed !== 'boolean') {
      next(new Error(`Invalid Input: Field "completed" must be a boolean value`));
    }
    if (priority !== undefined && typeof priority !== 'string' && !(priorities.includes(priority))) {
      next(new Error(`Field Priority can only have any of ${priorities}`));
    }
    const task = await writeTasks({
      title,
      description,
      completed: completed === undefined ? false : completed,
      priority: priority !== undefined ? priority : 'low',
      createdAt: new Date()
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * Modifies an existing task by its ID.
 *
 * @route PUT /tasks/:id
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the task to modify.
 * @param {Object} req.body - The request body containing task updates.
 * @param {string} [req.body.title] - The updated title of the task.
 * @param {string} [req.body.description] - The updated description of the task.
 * @param {boolean} [req.body.completed] - The updated completion status of the task.
 * @param {string} [req.body.priority] - The updated priority of the task.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Sends a JSON response to the client with the
 * updated task.
 * task.
 */
const modifyTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {title, description, completed, priority} = req.body;

    const taskObject = {};
    if (title !== undefined || title) {
      validateField(title, 'Title');
      taskObject.title = title;
    }
    if (description) {
      validateField(description, 'Description');
      taskObject.description = description;
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return next(
          new Error("Invalid Input: Field Completed should be a boolean value")
        );
      }
      taskObject.completed = completed;
    }
    if (priority !== undefined) {
      if (typeof priority !== "string") {
        return next(
          new Error("Invalid Input: Field Priority should be a string value")
        );
      }
      if (!(priorities.includes(priority.trim()))) {
        return next(
          new Error(`Invalid Input: Field Priority can only have any of ${priorities}`)
        );
      }
      taskObject.priority = priority;
    }
    const task = await updateTaskById(parseInt(id), taskObject);
    res.status(200).json(task);
  } catch (error) {
    console.error(`Printing Error: ${error}`);
    next(error)
  }
}

/**
 * Deletes a task by its ID.
 *
 * @route DELETE /tasks/:id
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the task to delete.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Send a message "Successfully deleted task ${req.params.id}"
 */
const deleteTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const response = await deleteTask(parseInt(id));
    res.status(200).json({message: response});
  } catch (error) {
    next(error);
  }
}


/**
 * Retrieve a list of tasks based on Priority
 *
 * @route GET /tasks/priority/:level
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.level - The Priority level of the tasks to Retrieve.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Send a list of task whose priority matches
 * with the queried priority in json format.
 */
const retrieveTasksByPriority = async (req, res, next) => {
  try {
    const {level} = req.params;
    if(!priorities.includes(level)) {
      next(
        new Error(`Invalid Input: Field Priority should be either of ${priorities}`)
      );
    }
    const tasks = await findAll({level: level});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  retrieveTasks,
  modifyTaskById,
  retrieveTaskById,
  deleteTaskById,
  retrieveTasksByPriority,
}
