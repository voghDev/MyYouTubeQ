// Content script for YouTube pages
const STORAGE_KEY = 'youtubeQueue';

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

// Create and add the "Add to Queue" button
function createAddToQueueButton() {
  // Check if we're on a video page
  if (!window.location.href.includes('youtube.com/watch')) {
    return;
  }

  // Wait for the actions bar to load
  const checkActionsBar = setInterval(() => {
    const actionsBar = document.querySelector('#actions ytd-menu-renderer');

    if (actionsBar && !document.getElementById('addToQueueBtn')) {
      clearInterval(checkActionsBar);

      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'addToQueueBtn';
      buttonContainer.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin-left: 8px;
      `;

      // Create button
      const button = document.createElement('button');
      button.innerHTML = `
        <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
        </svg>
        <span style="margin-left: 6px;">Add to Queue</span>
      `;
      button.style.cssText = `
        background: #cc0000;
        color: white;
        border: none;
        border-radius: 18px;
        padding: 10px 16px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        transition: background-color 0.2s;
        font-family: "Roboto","Arial",sans-serif;
      `;

      button.addEventListener('mouseenter', () => {
        button.style.background = '#a00000';
      });

      button.addEventListener('mouseleave', () => {
        button.style.background = '#cc0000';
      });

      button.addEventListener('click', addOrRemoveCurrentVideoInQueue);

      buttonContainer.appendChild(button);
      actionsBar.parentElement.appendChild(buttonContainer);

      // Update button state based on queue
      updateButtonState(button);
    }
  }, 500);

  // Stop checking after 10 seconds
  setTimeout(() => clearInterval(checkActionsBar), 10000);
}

// Add or remove current video from queue
function addOrRemoveCurrentVideoInQueue() {
  const videoTitle = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() ||
                     document.querySelector('h1 yt-formatted-string')?.textContent?.trim() ||
                     document.title.replace(' - YouTube', '');

  const videoUrl = window.location.href;

  if (!videoTitle || !videoUrl) {
    alert('Could not get video information');
    return;
  }

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    const currentVideoId = getYouTubeVideoId(videoUrl);

    // Check if video already exists in queue (compare by video ID)
    const existingIndex = queue.findIndex(video => getYouTubeVideoId(video.url) === currentVideoId);

    if (existingIndex !== -1) {
      // Video is in queue, remove it
      queue.splice(existingIndex, 1);
      chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
        showSuccessMessage('Removed from MyYouTubeQ!');
        updateButtonStateForAllButtons();
      });
    } else {
      // Video is not in queue, add it
      queue.push({ url: videoUrl, title: videoTitle });
      chrome.storage.sync.set({ [STORAGE_KEY]: queue }, function() {
        showSuccessMessage('Added to MyYouTubeQ!');
        updateButtonStateForAllButtons();
      });
    }
  });
}

// Update button state based on whether video is in queue
function updateButtonState(button) {
  const videoUrl = window.location.href;

  chrome.storage.sync.get([STORAGE_KEY], function(result) {
    const queue = result[STORAGE_KEY] || [];
    const currentVideoId = getYouTubeVideoId(videoUrl);
    const isInQueue = queue.some(video => getYouTubeVideoId(video.url) === currentVideoId);

    if (isInQueue) {
      // Video is in queue - show "Remove from Queue" with blue color
      button.innerHTML = `
        <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
        </svg>
        <span style="margin-left: 6px;">Remove from Queue</span>
      `;
      button.style.background = '#065fd4';

      button.onmouseenter = () => {
        button.style.background = '#0448a0';
      };
      button.onmouseleave = () => {
        button.style.background = '#065fd4';
      };
    } else {
      // Video is not in queue - show "Add to Queue" with red color
      button.innerHTML = `
        <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
        </svg>
        <span style="margin-left: 6px;">Add to Queue</span>
      `;
      button.style.background = '#cc0000';

      button.onmouseenter = () => {
        button.style.background = '#a00000';
      };
      button.onmouseleave = () => {
        button.style.background = '#cc0000';
      };
    }
  });
}

// Update all buttons on the page
function updateButtonStateForAllButtons() {
  const button = document.querySelector('#addToQueueBtn button');
  if (button) {
    updateButtonState(button);
  }
}

// Show success message
function showSuccessMessage(text = 'Added to MyYouTubeQ!') {
  const message = document.createElement('div');
  message.textContent = text;
  message.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: #00c853;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => message.remove(), 300);
  }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize when page loads
createAddToQueueButton();

// Re-create button when navigating within YouTube (SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    createAddToQueueButton();
  }
}).observe(document.body, { subtree: true, childList: true });
