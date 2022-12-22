import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TodoGroup, TodoFolder, Todo } from '../../types/todos';

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
  todos: [
    { date: 0, deadline: 0, id: 0, text: 'test'},
    { date: 0, deadline: 0, id: 1, text: 'test2'},
    { date: 0, deadline: 0, id: 2, text: 'test3'}
  ],
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

const initialTodoFolders = JSON.parse(localStorage.getItem('todofolders') || '[]')
const initialGroups = JSON.parse(localStorage.getItem('groups') || '[]')

interface UpdateStorageProps {
  groups?: TodoGroup[];
  folders?: TodoFolder[];
}
const updateStorage = ({ groups, folders }: UpdateStorageProps) => {
  if (groups !== undefined) {
    localStorage.setItem('groups', JSON.stringify(groups))
  }

  if (folders !== undefined) {
    localStorage.setItem('todofolders', JSON.stringify(folders))
  }
}
const initialState: TodoState = {
  todofolders: initialTodoFolders,
  groups: initialGroups,
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
      updateStorage({ folders: state.todofolders })
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

      updateStorage({ groups: state.groups, folders: state.todofolders});
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

      updateStorage({ groups: state.groups, folders: state.todofolders});
    },
    addGroupToFolder: (state, action: PayloadAction<{groupId: number, folder: string}>) => {
      const { groupId, folder } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, belongsTo: folder}
        }
        return group;
      })

      updateStorage({ groups: state.groups });
    },
    removeGroupFromFolder: (state, action: PayloadAction<{ groupId: number }>) => {
      const { groupId } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, belongsTo: undefined}
        }
        return group;
      })
      updateStorage({ groups: state.groups });
    },
    addNewGroup: (state, action: PayloadAction<Omit<TodoGroup, 'id'>>) => {
      state.groups = [...state.groups, 
        {...action.payload, todos: [],
        id: state.groups.length + 1 
      }]
      updateStorage({ groups: state.groups });
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
        updateStorage({ groups: state.groups });

        
    },
    addGroupTodo: (state, action: PayloadAction<{ groupId: number, todo: Omit<Todo, 'id'> }>) => {
      const { groupId, todo } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, todos: [...group.todos, { ...todo, id: group.todos.length + 1 }]}
        } else {
          return group;
        }
      }
      )
      state.currentGroup = state.groups.find(group => {
        return group.id === groupId
      })

      updateStorage({ groups: state.groups });
    },
    deleteGroupTodo: (state, action: PayloadAction<{ groupId: number, todoId: number }>) => {
      const { groupId, todoId } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, todos: group.todos.filter((todo) => {
            return todo.id !== todoId
          }).map((todo: Todo, index) => {
            return {...todo, id: index}
          })
          }
        } else {
          return group;
        }
      })
      updateStorage({ groups: state.groups });
    },
    setGroupTodoCompleted: (state, action: PayloadAction<{ groupId: number, todoId: number }>) => {
      const { groupId, todoId } = action.payload;
      state.groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {...group, todos: group.todos.map((todo) => {
            if (todo.id === todoId) {
              return {...todo, completed: Date.now()}
            } else {  
              return todo
            }
          })}
        } else {
          return group;
        }
      })
      state.currentGroup = state.groups.find(group => {
        return group.id === groupId
      }) ?? undefined;
      updateStorage({ groups: state.groups });
    },
    updateGroupTodos: (state, action: PayloadAction<{ groupId: number, todoList: Todo[] }>) => {
      const newKeyTodoList = action.payload.todoList.map((todo, index) => {
        return {...todo, id: index}
      })

      const test = state.groups.map((group) => {
        if (group.id === action.payload.groupId) {
          return {...group, todos: newKeyTodoList}
        }
        return group;
      })
      state.groups = test;

      state.currentGroup = state.groups.find(group => {
        return group.id === action.payload.groupId
      }) ?? undefined;

      updateStorage({ groups: state.groups });
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
  setLatestGroup,
  updateGroupTodos,
  addGroupTodo,
  deleteGroupTodo,
  setGroupTodoCompleted,
} = todoSlice.actions


export default todoSlice.reducer