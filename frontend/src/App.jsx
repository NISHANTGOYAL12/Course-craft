import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';
import Navbar from './components/Navbar';
import ProjectList from './pages/ProjectList';
import ProjectEditor from './pages/ProjectEditor';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/project/:id" element={<ProjectEditor />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App; 