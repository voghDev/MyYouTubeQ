// Storage key for the video queue
const STORAGE_KEY = 'youtubeQueue';

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  loadQueue();

  // Event listeners
  document.getElementById('addBtn').addEventListener('click', addVideo);
  document.getElementById('addCurrentBtn').addEventListener('click', addCurrentPage);

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

// Add current YouTube page to queue
function addCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];

    if (!tab.url || !tab.url.includes('youtube.com/watch')) {
      alert('Please navigate to a YouTube video page');
      return;
    }

    chrome.storage.sync.get([STORAGE_KEY], function(result) {
      const queue = result[STORAGE_KEY] || [];
      queue.push({ url: tab.url, title: tab.title });

      chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
        loadQueue();
      });
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

// Delete a video
function deleteVideo(index) {
  if (!confirm('Delete this video from the queue?')) return;

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    queue.splice(index, 1);

    chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
      loadQueue();
    });
  });
}
