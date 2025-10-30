# MyYouTubeQ

MyYouTubeQ is a Google Chrome Extension that allows you to save YouTube videos and watch them later. Build your personal video queue while browsing YouTube, and manage it easily from a convenient popup interface. Perfect for organizing videos you want to watch without cluttering your YouTube playlists.

## Features

- **Quick Save**: Add videos to your queue with one click while browsing YouTube
- **Manual Entry**: Add videos by URL and title manually
- **Full Management**: Edit, delete, or visit videos in your queue
- **Sync Across Devices**: Your queue syncs across all Chrome browsers where you're signed in
- **Clean Interface**: Simple, YouTube-inspired design

## Installing

### Step 1: Download the Extension

Choose one of the following methods:

**Option A: Clone from GitHub**
```bash
git clone https://github.com/voghDev/MyYouTubeQ.git
cd MyYouTubeQ
```

**Option B: Download as ZIP**
1. Go to https://github.com/voghDev/MyYouTubeQ
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a location on your computer

### Step 2: Generate Icons

Before loading the extension, you need to generate the icon files:

1. Navigate to the extension folder
2. Open `generate-icons.html` in any web browser (Chrome, Firefox, Safari, etc.)
3. The browser will automatically download three icon files:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
4. Move these three PNG files to the extension folder (same location as `manifest.json`)

### Step 3: Load Extension in Chrome

1. Open Google Chrome
2. Navigate to the Extensions page:
   - Type `chrome://extensions` in the address bar and press Enter
   - **OR** click the three-dot menu (⋮) → More Tools → Extensions
3. Enable **Developer mode** by toggling the switch in the top-right corner
4. Click the **"Load unpacked"** button
5. Navigate to and select the MyYouTubeQ folder (where you extracted/cloned the extension)
6. Click **"Select"** (or "Open")
7. The MyYouTubeQ extension should now appear in your extensions list

### Step 4: Restart Chrome (Optional but Recommended)

For best results, restart Chrome after installing the extension.

## Usage

### Pinning the Extension to Your Toolbar

To make the MyYouTubeQ button permanently visible in your Chrome toolbar:

1. Look for the **puzzle piece icon** (🧩) in your Chrome toolbar
2. Click it to open the extensions menu
3. Find **"MyYouTubeQ"** in the list
4. Click the **pin icon** (📌) next to it

The extension button will now appear in your toolbar for quick access!

![Pinned extension button in Chrome toolbar]()
*Screenshot placeholder: Extension icon pinned in the toolbar*

### Adding Videos to Your Queue

**Method 1: From YouTube Video Pages**

When watching any YouTube video, you'll see an "Add to Queue" button below the video player (near the like/share buttons):

![Add to Queue button on YouTube]()
*Screenshot placeholder: "Add to Queue" button on a YouTube video page*

Simply click this button to add the current video to your queue.

**Method 2: From the Extension Popup**

1. Click the MyYouTubeQ icon in your toolbar
2. If you're on a YouTube video page, click **"Add Current Page"**
3. Or manually enter a video URL and title, then click **"Add to Queue"**

### Managing Your Queue

Click the MyYouTubeQ extension icon to open the queue manager:

![Extension popup showing video queue]()
*Screenshot placeholder: MyYouTubeQ popup window with list of videos*

From here you can:

- **View all saved videos**: See your complete queue with titles and URLs
- **Visit a video**: Click the **"Visit"** button to open the video in a new tab
- **Edit a video**: Click the **"Edit"** button to modify the title or URL
- **Delete a video**: Click the **"Delete"** button to remove it from your queue
- **See queue count**: The counter shows how many videos are in your queue

### Storage and Sync

- Videos are stored using Chrome's sync storage
- Your queue automatically syncs across all Chrome browsers where you're signed in
- Storage capacity: Approximately 500-1000 videos (depending on URL and title lengths)

## Troubleshooting

**Extension not showing up?**
- Verify all files are in the correct folder
- Make sure Developer mode is enabled in `chrome://extensions`
- Try clicking the "Reload" button under the extension

**"Add to Queue" button not appearing on YouTube?**
- Refresh the YouTube page
- Ensure the extension is enabled in `chrome://extensions`
- Verify you're on a video page (not homepage or search results)

**Icons not displaying?**
- Confirm you generated the icons using `generate-icons.html`
- Check that all three PNG files are in the extension folder
- Try reloading the extension in `chrome://extensions`

## Uninstalling

1. Go to `chrome://extensions`
2. Find MyYouTubeQ
3. Click **"Remove"**
4. Confirm deletion

**Note**: Your saved video queue will be deleted when you uninstall the extension.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on the [GitHub repository](https://github.com/voghDev/MyYouTubeQ/issues).
