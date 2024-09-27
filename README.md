# Task Manager

This API allows you to manage tasks with full CRUD (Create, Read, Update, Delete) functionality.

## Setup Instructions
This project requires nodejs and npm install.
1. Clone the Project 
   
   `git clone https://github.com/airtribe-projects/task-manager-api-souzaavi.git`
2. Navigate to the project directory

   `cd /path/to/project/task-manager-api-souzaavi`
3. Install dependencies
  `npm install`
4. Start Development Server
  `npm run start`
5. Use postman to test endpoint.
6. Run Test
`npm rum test`

## GET /tasks

Retrieves all tasks.

**Sorting**

By default, the API sorts tasks by `id` in ascending order. To sort tasks by `createdAt`, you can use the following query parameters:

* `field=createdAt`:  Sorts the tasks by creation date. (Default: `id`)
* `asc=true|false`:  Sorts in ascending (`true`) or descending (`false`) order. (Default: `true`)

**Filtering**

To filter tasks by completion status, use the following query parameter:

* `completed=true|false`: Filters tasks by their completion status.


**Examples**

* **Fetch all tasks ordered by ID in ascending order (default behavior):**
GET /tasks


* **Fetch all tasks ordered by creation date in descending order:**

  GET /tasks?field=createdAt&asc=false


* **Fetch all completed tasks:**

  GET /tasks?completed=true


* **Fetch all incomplete tasks ordered by creation date in ascending order:**
  
  GET /tasks?completed=false&field=createdAt&asc=true

## GET /tasks/priority/:level

Retrieves tasks by priority level.

**Priority Levels:**

* `low`
* `medium`
* `high`

**Example**

* **Fetch all high priority tasks:**
  
  GET /tasks/priority/high


**Response**

The API returns a JSON array of task objects. Each task object has the following properties:

* `id`: (integer) The unique ID of the task.
* `title`: (string) The title of the task.
* `description`: (string) The description of the task.
* `createdAt`: (datetime) The date and time when the task was created.
* `completed`: (boolean) Indicates whether the task is completed.
* priority: (string) Indicates the priority of the tasks between low, medium and high

**Example Response:**

```json
[
    {
        "id": 2,
        "title": "Create a new project",
        "description": "Create a new project using the Express application generator",
        "completed": true,
        "createdAt": "2024-09-27T13:42:08.316Z",
        "priority": "high"
    },
    {
        "id": 3,
        "title": "Install nodemon",
        "description": "Install nodemon as a development dependency",
        "completed": true,
        "createdAt": "2024-09-27T13:48:39.855Z",
        "priority": "medium"
    },
    {
        "id": 4,
        "title": "Install Express",
        "description": "Install Express",
        "completed": false,
        "createdAt": "2024-09-27T13:49:47.239Z",
        "priority": "high"
    },
    {
        "id": 5,
        "title": "Install Mongoose",
        "description": "Install Mongoose",
        "completed": false,
        "createdAt": "2024-09-27T13:48:27.138Z",
        "priority": "low"
    }
]

```
## Get /tasks/:id

Retrieves a single task by its ID.

**Example**

* **Fetch the task with ID 123:**

  GET /tasks/123

**Response**

If the task is found, the API returns a task object:

```json
{
    "id": 2,
    "title": "Create a new project",
    "description": "Create a new project using the Express application generator",
    "completed": true,
    "createdAt": "2024-09-27T13:42:08.316Z",
    "priority": "high"
}
```

**Error Response**

If the task is not found, the API returns a 404 status code with the following error response:

```json
{
  "error": "Unable to find task"
}
```

## POST /tasks
Creates a new task.

Request Body
```json
{
  "title": "string",
  "description": "string",
  "completed": true,
  "priority": "medium"
}
```

**Mandatory Fields:**
* `title`
* `description`

**Optional Fields:**
* `completed` (Default: false)
* `priority` (Default: low)
* The `createdAt` field will be automatically set to the current UTC time.

**Example Request**

```json
{
  "title": "Create Readme.md file",
  "description": "For writing documentation"
}
```

**Response**

The API returns the newly created task object with a 201 status code.

**Example Response**
```json
{
  "id": 3,
  "title": "Create Readme.md file",
  "description": "For writing documentation",
  "completed": false,
  "createdAt": "2024-09-27T20:55:00Z",
  "priority": "low"
}
```

## PUT /tasks/:id
Updates an existing task. All fields of the task except `createdAt` can be updated.

**Example**

* Update the task with ID 123:

  PUT /tasks/123

**Request Body**
```json
{
  "title": "string",
  "description": "string",
  "completed": true,
  "priority": "low"
}
```

**Response**
* The API returns the updated task object.

**Example Response**

```json
{
  "id": 123,
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "createdAt": "2024-09-26T14:30:00Z",
  "priority": "high"
}
```

**Error Response**

If the task is not found, the API returns a 404 status code with the following error response:

```json
{
  "error": "Unable to find task"
}
```

## DELETE /tasks/:id
Deletes a task by its ID.

**Example**

* Delete the task with ID 123:

  DELETE /tasks/123

**Response**

If the task is found and deleted successfully, the API returns a 200 status code with a below response.

```json
{
    "message": "Successfully deleted task: 16"
}
```

**Error Response**

If the task is not found, the API returns a 404 status code with the following error response:

```json
{
    "error": "unable to find Task"
}
```





