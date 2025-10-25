# GenAI Task: TypeScript Table Component for Task Management

## Overview

This document contains a TypeScript implementation of a Table component for a simple task management system with full CRUD (Create, Read, Update, Delete) functionality.

## Requirements

- Create, read, update, and delete tasks (CRUD)
- Each task has: title, description, status, and due_date
- Tasks are associated with a user (basic User model)

## Implementation

### Type Definitions

```typescript
/**
 * User interface representing a basic user model
 */
interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Task status enum
 */
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

/**
 * Task interface representing a task in the system
 */
interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: Date;
  userId: number;
  user?: User;
}

/**
 * Props for the TaskTable component
 */
interface TaskTableProps {
  tasks: Task[];
  users: User[];
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: number, task: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}
```

### Task Table Component

```typescript
import React, { useState } from 'react';

/**
 * TaskTable Component
 * A comprehensive table component for managing tasks with CRUD operations
 * @param {TaskTableProps} props - Component props
 * @returns {JSX.Element} Task table with CRUD functionality
 */
export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  users,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // State for new task form
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    due_date: new Date(),
    userId: users[0]?.id || 0,
  });

  // State for editing task
  const [editTask, setEditTask] = useState<Task | null>(null);

  /**
   * Handles creating a new task
   */
  const handleCreate = () => {
    if (!newTask.title || !newTask.description) {
      alert('Title and description are required');
      return;
    }

    onCreateTask(newTask);
    setNewTask({
      title: '',
      description: '',
      status: TaskStatus.TODO,
      due_date: new Date(),
      userId: users[0]?.id || 0,
    });
    setIsCreating(false);
  };

  /**
   * Handles updating an existing task
   */
  const handleUpdate = () => {
    if (!editTask) return;

    onUpdateTask(editTask.id, editTask);
    setEditingId(null);
    setEditTask(null);
  };

  /**
   * Handles deleting a task
   * @param {number} id - Task ID to delete
   */
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(id);
    }
  };

  /**
   * Starts editing a task
   * @param {Task} task - Task to edit
   */
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTask({ ...task });
  };

  /**
   * Cancels editing
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditTask(null);
  };

  /**
   * Gets user name by ID
   * @param {number} userId - User ID
   * @returns {string} User name
   */
  const getUserName = (userId: number): string => {
    return users.find((u) => u.id === userId)?.name || 'Unknown';
  };

  /**
   * Formats date for display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  /**
   * Gets status badge color
   * @param {TaskStatus} status - Task status
   * @returns {string} CSS class for status badge
   */
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-200 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-200 text-blue-800';
      case TaskStatus.DONE:
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isCreating ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <select
              value={newTask.userId}
              onChange={(e) =>
                setNewTask({ ...newTask, userId: parseInt(e.target.value) })
              }
              className="px-3 py-2 border rounded"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="px-3 py-2 border rounded md:col-span-2"
              rows={3}
            />
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value as TaskStatus })
              }
              className="px-3 py-2 border rounded"
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>
            <input
              type="date"
              value={newTask.due_date.toISOString().split('T')[0]}
              onChange={(e) =>
                setNewTask({ ...newTask, due_date: new Date(e.target.value) })
              }
              className="px-3 py-2 border rounded"
            />
          </div>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Task
          </button>
        </div>
      )}

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                ID
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Title
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Due Date
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Assigned To
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                {editingId === task.id && editTask ? (
                  // Edit Mode
                  <>
                    <td className="px-6 py-4 border-b">{task.id}</td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="text"
                        value={editTask.title}
                        onChange={(e) =>
                          setEditTask({ ...editTask, title: e.target.value })
                        }
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <textarea
                        value={editTask.description}
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            description: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded w-full"
                        rows={2}
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <select
                        value={editTask.status}
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            status: e.target.value as TaskStatus,
                          })
                        }
                        className="px-2 py-1 border rounded"
                      >
                        <option value={TaskStatus.TODO}>To Do</option>
                        <option value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </option>
                        <option value={TaskStatus.DONE}>Done</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="date"
                        value={
                          new Date(editTask.due_date)
                            .toISOString()
                            .split('T')[0]
                        }
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            due_date: new Date(e.target.value),
                          })
                        }
                        className="px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <select
                        value={editTask.userId}
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            userId: parseInt(e.target.value),
                          })
                        }
                        className="px-2 py-1 border rounded"
                      >
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // View Mode
                  <>
                    <td className="px-6 py-4 border-b">{task.id}</td>
                    <td className="px-6 py-4 border-b font-medium">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 border-b">{task.description}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      {formatDate(task.due_date)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {getUserName(task.userId)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No tasks found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### Usage Example

```typescript
import React, { useState } from 'react';
import { TaskTable } from './TaskTable';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the API',
      status: TaskStatus.IN_PROGRESS,
      due_date: new Date('2025-11-01'),
      userId: 1,
    },
    {
      id: 2,
      title: 'Code review',
      description: 'Review pull requests from team members',
      status: TaskStatus.TODO,
      due_date: new Date('2025-10-28'),
      userId: 2,
    },
  ]);

  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const handleCreateTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id: number, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TaskTable
      tasks={tasks}
      users={users}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
    />
  );
}

export default App;
```

## Features

### Create (C)
- Click "New Task" button to open creation form
- Fill in title, description, status, due date, and assign to a user
- Form validation ensures required fields are filled
- New task is added to the table upon successful creation

### Read (R)
- All tasks are displayed in a table format
- Shows ID, title, description, status (with color-coded badges), due date, and assigned user
- Empty state message when no tasks exist

### Update (U)
- Click "Edit" button on any task row
- Inline editing with form fields for all task properties
- "Save" button commits changes
- "Cancel" button discards changes

### Delete (D)
- Click "Delete" button on any task row
- Confirmation dialog prevents accidental deletion
- Task is removed from the table upon confirmation

## Styling

The component uses Tailwind CSS for styling with:
- Responsive design
- Color-coded status badges
- Hover effects for better UX
- Clean table layout with proper spacing

## Additional Features

- **User Assignment**: Each task can be assigned to a user from a dropdown
- **Status Management**: Three status levels (TODO, IN_PROGRESS, DONE)
- **Date Handling**: Proper date input and formatting
- **Validation**: Basic form validation for required fields
- **Confirmation**: Delete confirmation to prevent accidents
- **Empty State**: Friendly message when no tasks exist

## Notes

- This component assumes Tailwind CSS is installed and configured
- For production use, consider adding:
  - Backend API integration
  - Proper error handling
  - Loading states
  - Form validation library (e.g., Zod, Yup)
  - Toast notifications for actions
  - Pagination for large datasets
  - Search and filter functionality
