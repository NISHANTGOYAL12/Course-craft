import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';

export default function LessonList({ lessons, moduleId, projectId }) {
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const { updateProject } = useProject();

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditedTitle(lesson.title);
  };

  const handleSaveEdit = async (lessonId) => {
    try {
      const updatedLessons = lessons.map((lesson) =>
        lesson.id === lessonId
          ? { ...lesson, title: editedTitle }
          : lesson
      );

      const updatedModules = currentProject.modules.map((module) =>
        module.id === moduleId
          ? { ...module, lessons: updatedLessons }
          : module
      );

      await updateProject(projectId, { modules: updatedModules });
      setEditingLessonId(null);
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonId);
      const updatedModules = currentProject.modules.map((module) =>
        module.id === moduleId
          ? { ...module, lessons: updatedLessons }
          : module
      );

      await updateProject(projectId, { modules: updatedModules });
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const getLessonTypeIcon = (type) => {
    switch (type) {
      case 'youtube':
        return '🎥';
      case 'video':
        return '📹';
      case 'pdf':
        return '📄';
      case 'text':
        return '📝';
      default:
        return '📁';
    }
  };

  return (
    <Droppable droppableId={`module-${moduleId}`}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2"
        >
          {lessons.map((lesson, index) => (
            <Draggable
              key={lesson.id}
              draggableId={`lesson-${lesson.id}`}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {getLessonTypeIcon(lesson.type)}
                    </span>
                    {editingLessonId === lesson.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="input"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-900">{lesson.title}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {editingLessonId === lesson.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(lesson.id)}
                          className="btn btn-primary"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingLessonId(null)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="btn btn-secondary text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
} 