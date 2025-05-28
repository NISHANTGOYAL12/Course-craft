import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProjectContext = createContext();

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject:
          state.currentProject?.id === action.payload.id
            ? action.payload
            : state.currentProject,
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject:
          state.currentProject?.id === action.payload
            ? null
            : state.currentProject,
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_URL}/projects`);
      dispatch({ type: 'SET_PROJECTS', payload: response.data.data });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching projects',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create new project
  const createProject = async (name) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/projects`, { name });
      dispatch({ type: 'ADD_PROJECT', payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error creating project',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch single project
  const fetchProject = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${API_URL}/projects/${id}`);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error fetching project',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update project
  const updateProject = async (id, data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(`${API_URL}/projects/${id}`, data);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error updating project',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`${API_URL}/projects/${id}`);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error deleting project',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add module to project
  const addModule = async (projectId, name) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post(`${API_URL}/projects/${projectId}/modules`, {
        name,
      });
      const updatedProject = await fetchProject(projectId);
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      return response.data.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error adding module',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update module order
  const updateModuleOrder = async (projectId, moduleIds) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(
        `${API_URL}/projects/${projectId}/modules/order`,
        { moduleIds }
      );
      const updatedProject = await fetchProject(projectId);
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      return response.data.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Error updating module order',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const value = {
    ...state,
    createProject,
    fetchProject,
    updateProject,
    deleteProject,
    addModule,
    updateModuleOrder,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 