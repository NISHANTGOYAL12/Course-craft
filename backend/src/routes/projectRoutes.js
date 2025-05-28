const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// In-memory storage for projects (replace with database in production)
let projects = [];

// Get all projects
router.get('/', (req, res) => {
  res.json({ success: true, data: projects });
});

// Create a new project
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Project name is required' });
  }

  const newProject = {
    id: uuidv4(),
    name,
    modules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  res.status(201).json({ success: true, data: newProject });
});

// Get a single project
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

// Update a project
router.put('/:id', (req, res) => {
  const { name, modules } = req.body;
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const updatedProject = {
    ...projects[projectIndex],
    name: name || projects[projectIndex].name,
    modules: modules || projects[projectIndex].modules,
    updatedAt: new Date().toISOString()
  };

  projects[projectIndex] = updatedProject;
  res.json({ success: true, data: updatedProject });
});

// Delete a project
router.delete('/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  projects.splice(projectIndex, 1);
  res.json({ success: true, message: 'Project deleted successfully' });
});

// Add a module to a project
router.post('/:id/modules', (req, res) => {
  const { name } = req.body;
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (!name) {
    return res.status(400).json({ success: false, message: 'Module name is required' });
  }

  const newModule = {
    id: uuidv4(),
    name,
    lessons: [],
    order: projects[projectIndex].modules.length
  };

  projects[projectIndex].modules.push(newModule);
  projects[projectIndex].updatedAt = new Date().toISOString();

  res.status(201).json({ success: true, data: newModule });
});

// Update module order
router.put('/:id/modules/order', (req, res) => {
  const { moduleIds } = req.body;
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (!Array.isArray(moduleIds)) {
    return res.status(400).json({ success: false, message: 'Module IDs must be an array' });
  }

  // Update module order
  const updatedModules = moduleIds.map((id, index) => {
    const module = projects[projectIndex].modules.find(m => m.id === id);
    if (module) {
      return { ...module, order: index };
    }
    return null;
  }).filter(Boolean);

  projects[projectIndex].modules = updatedModules;
  projects[projectIndex].updatedAt = new Date().toISOString();

  res.json({ success: true, data: updatedModules });
});

module.exports = { projectRoutes: router }; 