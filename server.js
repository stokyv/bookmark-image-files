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
          max-height: 100vh; /* Set max-height to 100% of the viewport height */
          width: auto; /* Preserve aspect ratio */
          margin: auto; /* Center the image horizontally and vertically */
          margin-bottom: 10px;
          // max-width: 100%;
          // margin: auto;
          // margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="image-container">
        ${imageTags}
      </div> 

      <script>
        localStorage.removeItem('selectedImages');
        // let selectedImages = JSON.parse(localStorage.getItem('selectedImages')) || [];
        let selectedImages = [];
        
        const imageElements = document.querySelectorAll('.image-container img');

        let currentIndex = 0;

        document.addEventListener('keydown', handleKeyDown);

        function handleKeyDown(event) {
          if (event.key === 'ArrowRight') {
            showNextImage();
          } else if (event.key === 'ArrowLeft') {
            showPrevImage();
          } else if (event.key === 'b') {
            console.log("HELLO");
            addCurrentImageToList();
          } else if (event.key === 'd') {
            exportSelectedImagesToJSON();
          } else if (event.key === 's') {
            jumpToImage();
          }
        }

        function showNextImage() {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const nextImageTop = imageElements[currentIndex + 1].getBoundingClientRect().top + currentScroll;
          currentIndex = (currentIndex + 1) % imageElements.length;
          imageElements[currentIndex].scrollIntoView({ block: 'start' });
        }

        function showPrevImage() {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const prevImageTop = imageElements[currentIndex - 1].getBoundingClientRect().top + currentScroll;
          currentIndex = (currentIndex - 1 + imageElements.length) % imageElements.length;
          imageElements[currentIndex].scrollIntoView({ block: 'start' });
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

        function exportSelectedImagesToJSON() {
          const fileContent = JSON.stringify(selectedImages);
          const blob = new Blob([fileContent], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'selected_images.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }

        function jumpToImage() {
          const inputElement = document.createElement('input');
          inputElement.type = 'number';
          inputElement.placeholder = 'Enter image index';
          inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              const targetIndex = parseInt(inputElement.value);
              if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= imageElements.length) {
                console.log('Invalid index');
              } else {
                currentIndex = targetIndex;
                imageElements[currentIndex].scrollIntoView({ block: 'start' });
              }
              document.body.removeChild(inputElement);
            }
          });
          document.body.appendChild(inputElement);
          inputElement.focus();
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
