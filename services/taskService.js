const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, '../', 'task.json');

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