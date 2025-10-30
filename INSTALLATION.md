# MyYouTubeQ - Installation Instructions

## Generate Icons (Required First Step)

Before loading the extension, you need to generate the icon files:

1. Open `generate-icons.html` in any web browser (Chrome, Firefox, Safari, etc.)
2. The browser will automatically download three icon files: `icon16.png`, `icon48.png`, and `icon128.png`
3. Move these three PNG files to the same folder as the other extension files (`/Users/olmo.gallegos/projects/MyYouTubeQ`)

## Install Extension in Chrome

1. Open Google Chrome

2. Navigate to the Extensions page using one of these methods:
   - Type `chrome://extensions` in the address bar and press Enter
   - Or click the three-dot menu (⋮) → More Tools → Extensions

3. Enable "Developer mode" by toggling the switch in the top-right corner

4. Click the "Load unpacked" button that appears

5. Navigate to and select the folder: `/Users/olmo.gallegos/projects/MyYouTubeQ`

6. Click "Select" (or "Open" depending on your OS)

7. The MyYouTubeQ extension should now appear in your extensions list with a red icon

## Using the Extension

### Adding Videos

**Method 1: From YouTube video pages**
- Navigate to any YouTube video
- Look for the "Add to Queue" button below the video (near like/share buttons)
- Click it to add the current video to your queue

**Method 2: From the extension popup**
- Click the MyYouTubeQ extension icon in the Chrome toolbar
- Click "Add Current Page" button (works only on YouTube video pages)

**Method 3: Manual entry**
- Click the MyYouTubeQ extension icon
- Enter the video URL and title manually
- Click "Add to Queue"

### Managing Your Queue

- **View Queue**: Click the extension icon to see all saved videos
- **Visit Video**: Click the "Visit" button to open the video in a new tab
- **Edit Video**: Click the "Edit" button to modify the title or URL
- **Delete Video**: Click the "Delete" button to remove from queue

### Storage

- Videos are stored using Chrome's sync storage
- Your queue will sync across all Chrome browsers where you're signed in
- Storage limit: approximately 100KB total (roughly 500-1000 videos depending on URL/title lengths)

## Troubleshooting

**Extension not showing up?**
- Make sure all files are in the correct folder
- Verify that Developer mode is enabled
- Try clicking the "Reload" button under the extension in chrome://extensions

**"Add to Queue" button not appearing on YouTube?**
- Refresh the YouTube page
- Check that the extension is enabled in chrome://extensions
- Make sure you're on a video page (not the homepage or search results)

**Icons not displaying?**
- Make sure you generated the icons using generate-icons.html
- Verify the three PNG files are in the extension folder
- Try reloading the extension

## Uninstalling

1. Go to `chrome://extensions`
2. Find MyYouTubeQ
3. Click "Remove"
4. Confirm deletion

Your saved video queue will be deleted when you uninstall the extension.
