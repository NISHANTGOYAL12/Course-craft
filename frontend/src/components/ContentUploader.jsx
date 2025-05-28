import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ContentUploader({ projectId }) {
  const [activeTab, setActiveTab] = useState('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeInfo, setYoutubeInfo] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleYoutubeUrlSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    try {
      setUploading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/content/youtube/info`, {
        url: youtubeUrl,
      });
      setYoutubeInfo(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching video info');
    } finally {
      setUploading(false);
    }
  };

  const handleYoutubeDownload = async () => {
    if (!youtubeInfo || !selectedModule || !lessonTitle) return;

    try {
      setUploading(true);
      setError(null);
      await axios.post(`${API_URL}/content/youtube/download`, {
        url: youtubeUrl,
        projectId,
        moduleId: selectedModule,
        lessonTitle,
      });
      // Reset form
      setYoutubeUrl('');
      setYoutubeInfo(null);
      setSelectedModule('');
      setLessonTitle('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error downloading video');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedModule || !lessonTitle) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('moduleId', selectedModule);
    formData.append('lessonTitle', lessonTitle);

    try {
      setUploading(true);
      setError(null);
      await axios.post(`${API_URL}/content/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reset form
      e.target.value = '';
      setSelectedModule('');
      setLessonTitle('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('youtube')}
          className={`btn ${
            activeTab === 'youtube' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          YouTube
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`btn ${
            activeTab === 'file' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          File Upload
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {activeTab === 'youtube' ? (
        <div className="space-y-4">
          <form onSubmit={handleYoutubeUrlSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="youtubeUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  YouTube URL
                </label>
                <input
                  type="text"
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input mt-1"
                  placeholder="Enter YouTube video URL"
                />
              </div>
              <button
                type="submit"
                disabled={uploading || !youtubeUrl}
                className="btn btn-primary w-full"
              >
                {uploading ? 'Loading...' : 'Get Video Info'}
              </button>
            </div>
          </form>

          {youtubeInfo && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900">{youtubeInfo.title}</h3>
                <p className="text-sm text-gray-600">
                  Duration: {Math.floor(youtubeInfo.duration / 60)}:
                  {youtubeInfo.duration % 60}
                </p>
              </div>

              <div>
                <label
                  htmlFor="module"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Module
                </label>
                <select
                  id="module"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">Select a module</option>
                  {/* Add module options here */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="lessonTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lesson Title
                </label>
                <input
                  type="text"
                  id="lessonTitle"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="input mt-1"
                  placeholder="Enter lesson title"
                />
              </div>

              <button
                onClick={handleYoutubeDownload}
                disabled={uploading || !selectedModule || !lessonTitle}
                className="btn btn-primary w-full"
              >
                {uploading ? 'Downloading...' : 'Download Video'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="module"
              className="block text-sm font-medium text-gray-700"
            >
              Select Module
            </label>
            <select
              id="module"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="input mt-1"
            >
              <option value="">Select a module</option>
              {/* Add module options here */}
            </select>
          </div>

          <div>
            <label
              htmlFor="lessonTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Lesson Title
            </label>
            <input
              type="text"
              id="lessonTitle"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="input mt-1"
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Upload File
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileUpload}
              disabled={uploading || !selectedModule || !lessonTitle}
              className="mt-1"
              accept="video/*,application/pdf,text/*"
            />
          </div>
        </div>
      )}
    </div>
  );
} 