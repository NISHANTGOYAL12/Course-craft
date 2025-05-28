import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import LessonList from './LessonList';

export default function ModuleList({ modules, projectId }) {
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const { updateProject } = useProject();

  const handleEditModule = (module) => {
    setEditingModuleId(module.id);
    setEditedName(module.name);
  };

  const handleSaveEdit = async (moduleId) => {
    try {
      const updatedModules = modules.map((module) =>
        module.id === moduleId
          ? { ...module, name: editedName }
          : module
      );

      await updateProject(projectId, { modules: updatedModules });
      setEditingModuleId(null);
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      const updatedModules = modules.filter((module) => module.id !== moduleId);
      await updateProject(projectId, { modules: updatedModules });
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <Draggable key={module.id} draggableId={module.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="card"
            >
              <div
                {...provided.dragHandleProps}
                className="flex items-center justify-between mb-4"
              >
                {editingModuleId === module.id ? (
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {module.name}
                  </h3>
                )}

                <div className="flex items-center space-x-2">
                  {editingModuleId === module.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(module.id)}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingModuleId(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditModule(module)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="btn btn-secondary text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              <LessonList
                lessons={module.lessons}
                moduleId={module.id}
                projectId={projectId}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
} 