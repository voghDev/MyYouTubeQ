// Storage key for the video queue
const STORAGE_KEY = 'youtubeQueue';

// Undo state
let deleteTimeout = null;
let deletedVideo = null;
let deletedIndex = null;

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  loadQueue();
  updateCurrentPageButton(); // Check if current page is in queue

  // Event listeners
  document.getElementById('addBtn').addEventListener('click', addVideo);
  document.getElementById('addCurrentBtn').addEventListener('click', addOrRemoveCurrentPage);
  document.getElementById('undoBtn').addEventListener('click', undoDelete);

  // Allow Enter key to add video
  document.getElementById('videoUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addVideo();
  });
  document.getElementById('videoTitle').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addVideo();
  });
});

// Load and display the queue
function loadQueue() {
  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    displayQueue(queue);
    updateCurrentPageButton(); // Update button state when queue changes
  });
}

// Display the queue in the UI
function displayQueue(queue) {
  const videoList = document.getElementById('videoList');
  const queueCount = document.getElementById('queueCount');

  queueCount.textContent = queue.length;
  videoList.innerHTML = '';

  if (queue.length === 0) {
    videoList.innerHTML = '<p class="empty-message">No videos in queue</p>';
    return;
  }

  queue.forEach((video, index) => {
    const videoItem = createVideoItem(video, index);
    videoList.appendChild(videoItem);
  });
}

// Create a video item element
function createVideoItem(video, index) {
  const item = document.createElement('div');
  item.className = 'video-item';
  item.dataset.index = index;

  const content = document.createElement('div');
  content.className = 'video-content';

  const title = document.createElement('div');
  title.className = 'video-title';
  title.textContent = video.title;
  title.title = video.title;

  const url = document.createElement('div');
  url.className = 'video-url';
  url.textContent = video.url;
  url.title = video.url;

  content.appendChild(title);
  content.appendChild(url);

  const actions = document.createElement('div');
  actions.className = 'video-actions';

  const visitBtn = document.createElement('button');
  visitBtn.className = 'btn-visit';
  visitBtn.textContent = 'Visit';
  visitBtn.addEventListener('click', () => visitVideo(video.url));

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-edit';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => editVideo(index));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteVideo(index));

  actions.appendChild(visitBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  item.appendChild(content);
  item.appendChild(actions);

  return item;
}

// Add a video to the queue
function addVideo() {
  const urlInput = document.getElementById('videoUrl');
  const titleInput = document.getElementById('videoTitle');

  const url = urlInput.value.trim();
  const title = titleInput.value.trim();

  if (!url || !title) {
    alert('Please enter both URL and title');
    return;
  }

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    queue.push({ url, title });

    chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
      urlInput.value = '';
      titleInput.value = '';
      loadQueue();
    });
  });
}

// Add or remove current page from queue
function addOrRemoveCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];

    if (!tab.url || !tab.url.includes('youtube.com/watch')) {
      alert('Please navigate to a YouTube video page');
      return;
    }

    chrome.storage.sync.get([STORAGE_KEY], function(result) {
      const queue = result[STORAGE_KEY] || [];

      // Check if current video is already in queue (compare by video ID)
      const currentVideoId = getYouTubeVideoId(tab.url);
      const existingIndex = queue.findIndex(video => getYouTubeVideoId(video.url) === currentVideoId);

      if (existingIndex !== -1) {
        // Video is in queue, remove it
        queue.splice(existingIndex, 1);
        chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
          loadQueue();
          showSnackbar(`"${tab.title}" removed from queue`);
        });
      } else {
        // Video is not in queue, add it
        queue.push({ url: tab.url, title: tab.title });
        chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
          loadQueue();
          showSnackbar(`"${tab.title}" added to queue`);
        });
      }
    });
  });
}

// Update the "Add Current Page" button based on whether current page is in queue
function updateCurrentPageButton() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    const addCurrentBtn = document.getElementById('addCurrentBtn');

    // If not on a YouTube video page, disable button
    if (!tab.url || !tab.url.includes('youtube.com/watch')) {
      addCurrentBtn.textContent = 'Add Current Page';
      addCurrentBtn.classList.remove('in-queue');
      return;
    }

    chrome.storage.sync.get([STORAGE_KEY], function(result) {
      const queue = result[STORAGE_KEY] || [];
      const currentVideoId = getYouTubeVideoId(tab.url);
      const isInQueue = queue.some(video => getYouTubeVideoId(video.url) === currentVideoId);

      if (isInQueue) {
        addCurrentBtn.textContent = 'Remove from Queue';
        addCurrentBtn.classList.add('in-queue');
      } else {
        addCurrentBtn.textContent = 'Add to Queue';
        addCurrentBtn.classList.remove('in-queue');
      }
    });
  });
}

// Visit a video (open in new tab)
function visitVideo(url) {
  chrome.tabs.create({ url: url });
}

// Edit a video
function editVideo(index) {
  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    const video = queue[index];

    if (!video) return;

    const newTitle = prompt('Edit title:', video.title);
    if (newTitle === null) return; // User cancelled

    const newUrl = prompt('Edit URL:', video.url);
    if (newUrl === null) return; // User cancelled

    if (newTitle.trim() && newUrl.trim()) {
      queue[index] = { url: newUrl.trim(), title: newTitle.trim() };

      chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
        loadQueue();
      });
    } else {
      alert('Title and URL cannot be empty');
    }
  });
}

// Delete a video with undo capability
function deleteVideo(index) {
  // Clear any existing delete timeout
  if (deleteTimeout) {
    clearTimeout(deleteTimeout);
  }

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];

    // Store the deleted video and index for undo
    deletedVideo = queue[index];
    deletedIndex = index;

    // Remove from queue immediately for UI responsiveness
    queue.splice(index, 1);

    // Update storage and UI
    chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
      loadQueue();
      showSnackbar(`"${deletedVideo.title}" deleted`);

      // Set timeout to make deletion permanent (clear undo state)
      deleteTimeout = setTimeout(() => {
        deletedVideo = null;
        deletedIndex = null;
        deleteTimeout = null;
      }, 5000); // 5 seconds to undo
    });
  });
}

// Undo the last delete operation
function undoDelete() {
  if (!deletedVideo || deletedIndex === null) return;

  // Clear the timeout
  if (deleteTimeout) {
    clearTimeout(deleteTimeout);
    deleteTimeout = null;
  }

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];

    // Restore the video at its original position
    queue.splice(deletedIndex, 0, deletedVideo);

    chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
      loadQueue();
      hideSnackbar();

      // Clear undo state
      deletedVideo = null;
      deletedIndex = null;
    });
  });
}

// Show snackbar with message
function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  const snackbarMessage = document.getElementById('snackbarMessage');

  snackbarMessage.textContent = message;
  snackbar.classList.add('show');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideSnackbar();
  }, 5000);
}

// Hide snackbar
function hideSnackbar() {
  const snackbar = document.getElementById('snackbar');
  snackbar.classList.remove('show');
}
