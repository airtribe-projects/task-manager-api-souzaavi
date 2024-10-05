const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, '../', 'task.json');

/**
 * Retrieves a list of tasks from a JSON file, optionally filtered and ordered.
 *
 * @param {Object} [query] - An optional query object for filtering tasks.
 * @param {string} [query.completed] - Filter tasks by their completion status (e.g., "true" or "false").
 * @param {string} [query.level] - Filter tasks by their priority level.
 * @param {Object} [orderBy] - An optional object specifying the sorting order.
 * @param {string} [orderBy.field='id'] - The field to sort by ('id' or 'createdAt').
 * @param {boolean} [orderBy.asc=true] - Sort in ascending order (true) or descending order (false).
 * @returns {Promise<Object>} A promise that resolves with an object containing the tasks.
 * @throws {Error} If there is an error reading the file or parsing the JSON data.
 */
const findAll = (query, orderBy = {
  field: 'id',
  asc: true
}) => new Promise((resolve, reject) => {
  const {completed, level} = query || {};
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Unable to read file, Reason: ${err}`);
      reject(new Error('Internal Server Error'));
    } else {
      try {
        const {tasks} = JSON.parse(data);
        const {field, asc} = orderBy;
        if (field === 'id') {
          tasks.sort((a, b) => asc ? (a.id - b.id) : (b.id - a.id));
        }
        if (field === 'createdAt') {
          tasks.sort((a, b) => asc ?
            (new Date(a.createdAt) - new Date(b.createdAt)) :
            (new Date(b.createdAt) - new Date(a.createdAt))
          );
        }
        resolve({
            tasks: completed !== undefined ?
              tasks.filter((task) => task.completed === JSON.parse(completed)) :
              level !== undefined ? tasks.filter((task) => task.priority === level) :
                tasks
          }
        );
      } catch (parseError) {
        console.error(`Error Parsing data: ${parseError}`);
        reject(new Error('Internal Server Error'));
      }
    }
  });
});


/**
 * Finds a task by its ID.
 *
 * @param {number} taskId - The ID of the task to find.
 * @returns {Promise<Object>} A promise that resolves with the found task object.
 * @throws {Error} If the task is not found or if there's an error retrieving tasks.
 */
const findById = (taskId) => new Promise(async (resolve, reject) => {
  try {
    const {tasks} = await findAll();
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
      reject(new Error('Unable to find task'));
    }
    resolve(task);
  } catch (e) {
    console.error(e);
    reject(e);
  }
});


/**
 * Writes a new task to the JSON file.
 *
 * @param {Object} newTask - The new task object to be added.
 * @param {string} newTask.title - The title of the new task.
 * @param {string} newTask.description - The description of the new task.
 * @param {string} newTask.priority - The priority level of the new task.
 * @param {boolean} [newTask.completed=false] - The completion status of the new task (defaults to false).
 * @returns {Promise<Object>} A promise that resolves with the newly added task object.
 * @throws {Error} If there is an error writing to the file or retrieving existing tasks.
 */
const writeTasks = (newTask) => new Promise(async (resolve, reject) => {
  try {
    const {tasks} = await findAll();

    const task = {
      id: tasks.length + 1,
      ...newTask,
    }
    if (task.completed === undefined) {
      task.completed = false;
    }
    tasks.push(task);
    fs.writeFile(filePath, JSON.stringify({tasks: tasks}, null, 2), (err) => {
      if (err) {
        console.log(err);
        reject(new Error("Internal Server Error"));
      } else {
        resolve(task);
      }
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});


/**
 * Updates an existing task in the JSON file by its ID.
 *
 * @param {number} taskId - The ID of the task to update.
 * @param {Object} task - The updated task object.
 * @param {string} [task.title] - The updated title of the task.
 * @param {string} [task.description] - The updated description of the task.
 * @param {string} [task.priority] - The updated priority level of the task.
 * @param {boolean} [task.completed] - The updated completion status of the task.
 * @returns {Promise<Object>} A promise that resolves with the updated task object.
 * @throws {Error} If the task is not found or if there's an error writing to the file.
 */
const updateTaskById = (taskId, task) => new Promise(async (resolve, reject) => {
  try {
    const {tasks} = await findAll();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error("unable to find Task");
    }
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...task,
    };
    fs.writeFile(filePath, JSON.stringify({tasks: tasks}, null, 2), (err) => {
      if (err) {
        console.log(err);
        reject(new Error("Internal Server Error"));
      } else {
        resolve(tasks[taskIndex]);
      }
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});


/**
 * Deletes a task from the JSON file by its ID.
 *
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<string>} A promise that resolves with a success message.
 * @throws {Error} If the task is not found or if there's an error writing to the file.
 */
const deleteTask = (taskId) => new Promise(async (resolve, reject) => {
  try {
    const {tasks} = await findAll();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error("unable to find Task");
    }
    tasks.splice(taskIndex, 1);
    fs.writeFile(filePath, JSON.stringify({tasks: tasks}, null, 2), (err) => {
      if (err) {
        console.log(err);
        reject(new Error("Internal Server Error"));
      } else {
        resolve(`Successfully deleted task: ${taskId}`);
      }
    });
  } catch (e) {
    console.error(e);
    reject(e);
  }
});

module.exports = {
  findAll,
  findById,
  writeTasks,
  deleteTask,
  updateTaskById,
};
