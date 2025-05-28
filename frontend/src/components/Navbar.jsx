import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';

export default function Navbar() {
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { createProject, loading } = useProject();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const project = await createProject(projectName);
      setProjectName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">
            CourseCraft
          </Link>

          <div className="flex items-center space-x-4">
            {isCreating ? (
              <form onSubmit={handleCreateProject} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="input"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary"
              >
                New Project
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 