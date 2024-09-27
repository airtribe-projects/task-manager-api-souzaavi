const {
  findAll,
  findById,
  writeTasks,
  updateTaskById,
  deleteTask
} = require("../services/taskService");
const {error, throws} = require("tap");

const retrieveTasks = async (req, res, next) => {
  try {
    const {completed} = req.query;
    let {field = 'id', asc = 'true'} = req.query;
    if (asc === 'true') {
      asc = true;
    } else if (asc === 'false') {
      asc = false;
    } else {
      throw new Error('Invalid Input: asc can only have true or false values')
    }
    const {tasks} = await findAll({completed: completed}, {field, asc,});
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

const retrieveTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const task = await findById(parseInt(id));
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

function validateField(field, fieldName) {
  if (!field) {
    throw Error(`Invalid Input, Missing required field: ${fieldName}`);
  }
  if (typeof field !== 'string') {
    throw Error(`Invalid Input, Field ${fieldName} must be a string value`);
  }
  if (field.trim() === "") {
    throw Error(`Invalid Input, Field ${fieldName} can not be an empty string`);
  }
}

const priorities = ["low", "medium", "high"];

const createTask = async (req, res, next) => {
  try {
    const {title, description, completed, priority} = req.body;
    validateField(title, "Title");
    validateField(description, "Description");
    if (completed !== undefined && typeof completed !== 'boolean') {
      throw new Error(`Invalid Input: Field "completed" must be a boolean value`);
    }
    if (priority !== undefined && typeof priority !== 'string' && !(priorities.includes(priority))) {
      throw new Error(`Field Priority can only have any of ${priorities}`);
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
        throw new Error("Invalid Input: Field Completed should be a boolean" +
          " value");
      }
      taskObject.completed = completed;
    }
    if (priority !== undefined) {
      if (typeof priority !== "string") {
        throw new Error("Invalid Input: Field Priority should be a string" +
          " value");
      }
      if (!(priorities.includes(priority.trim()))) {
        throw new Error(`Invalid Input: Field Priority can only have any of ${priorities}`);
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

const deleteTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const response = await deleteTask(parseInt(id));
    res.status(200).json({message: response});
  } catch (error) {
    next(error);
  }
}

const retrieveTasksByPriority = async (req, res, next) => {
  try {
    const {level} = req.params;
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