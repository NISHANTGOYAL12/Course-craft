import { Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import AdManager from '../components/AdManager';

export default function ProjectList() {
  const { projects, loading, error } = useProject();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading projects...</div>
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No projects yet
        </h2>
        <p className="text-gray-600 mb-8">
          Create your first course project to get started
        </p>
        <AdManager adSlot="top-banner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h1>
      <AdManager adSlot="top-banner" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {project.name}
            </h2>
            <div className="text-sm text-gray-600">
              <p>Modules: {project.modules.length}</p>
              <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
      <AdManager adSlot="bottom-banner" />
    </div>
  );
} 