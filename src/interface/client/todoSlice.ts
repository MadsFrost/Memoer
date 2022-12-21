import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TodoGroup, TodoFolder } from '../../types/todos';

interface TodoState {
  todofolders: TodoFolder[];
  groups: TodoGroup[];
  folderView: string | undefined;
  currentGroup: TodoGroup | undefined;
  importantGroup: TodoGroup;
  expiringGroup: TodoGroup;
}

const defaultImportantGroup: TodoGroup = {
  id: 0,
  name: 'Important',
  todos: [],
  completedTodos: [],
  created: Date.now(),
  icon: 'star',
}

const defaultExpiringGroup: TodoGroup = {
  id: 0,
  name: 'Expiring',
  todos: [],
  completedTodos: [],
  created: Date.now(),
  icon: 'star',
}

const initialState: TodoState = {
  todofolders: [{
    id: 1,
    name: 'Test Folder'
  }],
  groups: [
    {
      id: 1,
      name: 'Expiring',
      todos: [],
      completedTodos: [],
      created: Date.now(),
      icon: 'star',
      belongsTo: 'Test Folder'
    },
    {
      id: 2,
      name: 'Other',
      todos: [],
      completedTodos: [],
      created: Date.now(),
      icon: 'university',
    }
],
  folderView: undefined,
  currentGroup: undefined,
  importantGroup: defaultImportantGroup,
  expiringGroup: defaultExpiringGroup
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setFolderView: (state, action: PayloadAction<string | undefined>) => {
      state.folderView = action.payload
    },
    addNewFolder: (state, action: PayloadAction<string>) => {
      const folderExists = state.todofolders.find(folder => {
        return folder.name === action.payload
      })
      if (!folderExists) {
        state.todofolders = [...state.todofolders, 
          {
            id: state.todofolders.length + 1,
            name: action.payload
          }]
      }
    },
    updateFolder: (state, action: PayloadAction<{ id: number, name: string }>) => {
      const oldTodoFolder = state.todofolders.find(folder => {
        return folder.id === action.payload.id
      })

      const nameExists = state.todofolders.find(folder => {
        return folder.name === action.payload.name
      })

      state.todofolders = state.todofolders.map((folder) => {
        if ((folder.id === action.payload.id) && !nameExists) {
          return {...folder, name: action.payload.name}
        } else {
          return folder
        } 
      })

      state.groups = state.groups.map((group) => {
        if (group.belongsTo === oldTodoFolder?.name) {
          return {...group, belongsTo: action.payload.name}
        } else {
          return group
        }
      })
    },
    removeFolder: (state, action: PayloadAction<number>) => {
      const removedFolder = state.todofolders.find(folder => {
        return folder.id === action.payload
      })

      const filtered = state.todofolders.filter(folder => {
        return folder.id !== action.payload
      })

      state.todofolders = filtered.map((folder, index) => {
        return {...folder, id: index + 1}
      })

      state.groups = state.groups.map((group) => {
        if (group.belongsTo === removedFolder?.name) {
          return {...group, belongsTo: undefined}
        } 
        return group;
      })
    },
    addGroupToFolder: (state, action: PayloadAction<{groupId: number, folder: string}>) => {
      const { groupId, folder } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, belongsTo: folder}
        }
        return group;
      })
    },
    removeGroupFromFolder: (state, action: PayloadAction<{ groupId: number }>) => {
      const { groupId } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, belongsTo: undefined}
        }
        return group;
      })
    },
    addNewGroup: (state, action: PayloadAction<Omit<TodoGroup, 'id'>>) => {
      state.groups = [...state.groups, {...action.payload, id: state.groups.length + 1 }]
    },
    removeGroups: (state, action: PayloadAction<number[]>) => {
        const filtered = state.groups.filter(group => {
            return !action.payload.includes(group.id)
        })

        if (state.currentGroup && action.payload.includes(state.currentGroup.id)) {
            state.currentGroup = undefined;
        }
        state.groups = filtered.map((group, index) => {
            return {...group, id: index + 1}
        })
    },
    setCurrentGroup: (state, action: PayloadAction<number>) => {
        const findGroup = state.groups.find(group => {
          return group.id === action.payload
        })

        state.currentGroup = findGroup ?? undefined;
    },
    setLatestGroup: (state) => {
        const latestGroup = state.groups[state.groups.length - 1];
        state.currentGroup = latestGroup ?? undefined;
    },
    setCurrentImportant: (state) => {
        state.currentGroup = state.importantGroup;
    },
    setCurrentExpiring: (state) => {
        state.currentGroup = state.expiringGroup;
    }
}})

export const { 
  addGroupToFolder, 
  addNewFolder,
  updateFolder,
  setFolderView,
  removeGroupFromFolder,
  removeFolder,
  addNewGroup, 
  removeGroups, 
  setCurrentGroup, 
  setLatestGroup 
} = todoSlice.actions


export default todoSlice.reducer