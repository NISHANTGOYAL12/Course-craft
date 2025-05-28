const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'text/plain',
      'application/zip'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get YouTube video info
router.post('/youtube/info', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'YouTube URL is required' });
  }

  try {
    // Use yt-dlp to get video info
    exec(`yt-dlp --dump-json "${url}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL or video unavailable' });
      }

      try {
        const videoInfo = JSON.parse(stdout);
        res.json({
          success: true,
          data: {
            title: videoInfo.title,
            duration: videoInfo.duration,
            thumbnail: videoInfo.thumbnail,
            url: url
          }
        });
      } catch (parseError) {
        res.status(500).json({ success: false, message: 'Error parsing video information' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching video information' });
  }
});

// Download YouTube video
router.post('/youtube/download', async (req, res) => {
  const { url, projectId, moduleId, lessonTitle } = req.body;
  if (!url || !projectId || !moduleId || !lessonTitle) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const videoId = uuidv4();
  const outputPath = path.join(__dirname, '../../uploads', `${videoId}.mp4`);

  try {
    // Start download process
    const downloadProcess = exec(
      `yt-dlp -f "best[ext=mp4]" -o "${outputPath}" "${url}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return res.status(500).json({ success: false, message: 'Error downloading video' });
        }

        res.json({
          success: true,
          data: {
            id: videoId,
            title: lessonTitle,
            type: 'youtube',
            filePath: `/uploads/${videoId}.mp4`,
            projectId,
            moduleId
          }
        });
      }
    );

    // Handle process events
    downloadProcess.stdout.on('data', (data) => {
      console.log(`Download progress: ${data}`);
    });

    downloadProcess.stderr.on('data', (data) => {
      console.error(`Download error: ${data}`);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error initiating download' });
  }
});

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { projectId, moduleId, lessonTitle } = req.body;
    if (!projectId || !moduleId || !lessonTitle) {
      // Clean up uploaded file if validation fails
      await fs.unlink(req.file.path);
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    res.json({
      success: true,
      data: {
        id: path.parse(req.file.filename).name,
        title: lessonTitle,
        type: req.file.mimetype,
        filePath: `/uploads/${req.file.filename}`,
        projectId,
        moduleId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
});

// Handle ZIP file upload and extraction
router.post('/upload/zip', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/zip') {
      await fs.unlink(req.file.path);
      return res.status(400).json({ success: false, message: 'File must be a ZIP archive' });
    }

    const { projectId, moduleId } = req.body;
    if (!projectId || !moduleId) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    // Extract ZIP file
    const extractPath = path.join(__dirname, '../../uploads', path.parse(req.file.filename).name);
    await fs.mkdir(extractPath, { recursive: true });

    // Use a ZIP extraction library here (implementation depends on chosen library)
    // For now, we'll just return the file info
    res.json({
      success: true,
      data: {
        id: path.parse(req.file.filename).name,
        type: 'zip',
        filePath: `/uploads/${req.file.filename}`,
        projectId,
        moduleId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing ZIP file' });
  }
});

module.exports = { contentRoutes: router }; 