const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Render the HTML page with image tags
app.get('/', (req, res) => {
  const imageFiles = getImageFiles('images');
  const imageTags = imageFiles.map((file, index) => `<img id="image-${index}" src="/images/${file}" alt="${file}">`).join('');
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Gallery</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
        }
        .image-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 50vw;
        }
        img {
          max-height: 100vh;
          width: auto;
          margin: auto;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="image-container">
        ${imageTags}
      </div>
      <script>
        let selectedImages = JSON.parse(localStorage.getItem('selectedImages')) || [];

        document.addEventListener('keydown', function(event) {
          if (event.key === 'ArrowRight') {
            scrollToNextImage();
          } else if (event.key === 'b') {
            addCurrentImageToList();
          }
        });

        function scrollToNextImage() {
          const images = document.querySelectorAll('img');
          let nextImage = null;

          for (const img of images) {
            const rect = img.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
              nextImage = img.nextElementSibling;
              break;
            }
          }

          if (nextImage) {
            nextImage.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }

        function addCurrentImageToList() {
          const visibleImage = getVisibleImage();
          if (visibleImage) {
            const filename = visibleImage.alt;
            if (!selectedImages.includes(filename)) {
              selectedImages.push(filename);
              localStorage.setItem('selectedImages', JSON.stringify(selectedImages));
              console.log('Added:', filename);
            } else {
              console.log('Already added:', filename);
            }
          }
        }

        function getVisibleImage() {
          const images = document.querySelectorAll('img');
          for (const img of images) {
            const rect = img.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
              return img;
            }
          }
          return null;
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// Helper function to get a list of image files in a directory
function getImageFiles(dir) {
  const fs = require('fs');
  const files = fs.readdirSync(dir);
  return files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});