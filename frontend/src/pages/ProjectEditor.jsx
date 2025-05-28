import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useProject } from '../contexts/ProjectContext';
import ModuleList from '../components/ModuleList';
import ContentUploader from '../components/ContentUploader';
import AdManager from '../components/AdManager';
import MonetizationOptions from '../components/MonetizationOptions';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    fetchProject,
    updateProject,
    updateModuleOrder,
    loading,
    error,
  } = useProject();
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');

  useEffect(() => {
    fetchProject(id).catch(() => {
      navigate('/');
    });
  }, [id, fetchProject, navigate]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const moduleIds = Array.from(currentProject.modules.map(m => m.id));
    const [removed] = moduleIds.splice(source.index, 1);
    moduleIds.splice(destination.index, 0, removed);

    try {
      await updateModuleOrder(id, moduleIds);
    } catch (error) {
      console.error('Error updating module order:', error);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;

    try {
      await updateProject(id, {
        modules: [
          ...currentProject.modules,
          {
            id: Date.now().toString(),
            name: newModuleName,
            lessons: [],
            order: currentProject.modules.length,
          },
        ],
      });
      setNewModuleName('');
      setIsAddingModule(false);
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!currentProject) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
        <button
          onClick={() => setIsAddingModule(true)}
          className="btn btn-primary"
        >
          Add Module
        </button>
      </div>

      <AdManager adSlot="sidebar" adFormat="vertical" />

      {isAddingModule && (
        <form onSubmit={handleAddModule} className="card">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="moduleName"
                className="block text-sm font-medium text-gray-700"
              >
                Module Name
              </label>
              <input
                type="text"
                id="moduleName"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                className="input mt-1"
                placeholder="Enter module name"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingModule(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Module
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  <ModuleList
                    modules={currentProject.modules}
                    projectId={currentProject.id}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <ContentUploader projectId={currentProject.id} />
          <AdManager adSlot="content-sidebar" />
          <MonetizationOptions projectId={currentProject.id} />
        </div>
      </div>
    </div>
  );
} 