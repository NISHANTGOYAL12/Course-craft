# CourseCraft

CourseCraft is a web application that allows users to build online courses by curating content from YouTube videos, uploaded video files, PDF notes, and other documents.

## Features

- Create and manage course projects
- Add YouTube videos (with download capability)
- Upload various file types (MP4, PDF, etc.)
- Organize content into modules and lessons
- Package courses for download
- Drag-and-drop interface for course organization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for yt-dlp)
- yt-dlp installed globally (`pip install yt-dlp`)

## Project Structure

```
coursecraft/
├── frontend/          # React frontend application
└── backend/           # Node.js backend server
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   UPLOAD_DIR=uploads
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create a new course project
3. Add content through YouTube links or file uploads
4. Organize content into modules and lessons
5. Package and download your course

## Dependencies

### Backend
- Express.js
- multer (for file uploads)
- yt-dlp (for YouTube video downloads)
- cors
- dotenv

### Frontend
- React
- Vite
- Tailwind CSS
- react-beautiful-dnd (for drag and drop)
- axios

## License

MIT

## Note

This application is for educational purposes. Users are responsible for ensuring they have the rights to use and repackage content from YouTube or other sources. #   C o u r s e - c r a f t  
 #   C o u r s e c r a f t  
 