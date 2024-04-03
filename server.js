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
          max-width: 100%;
          margin: auto;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="image-container">
        ${imageTags}
      </div>
      // <script>
      //   document.addEventListener('keydown', function(event) {
      //     if (event.key === 'ArrowRight') {
      //       scrollToNextImage();
      //     }
      //   });

      //   function scrollToNextImage() {
      //     const images = document.querySelectorAll('img');
      //     let nextImage = null;

      //     for (const img of images) {
      //       const rect = img.getBoundingClientRect();
      //       if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      //         nextImage = img.nextElementSibling;
      //         break;
      //       }
      //     }

      //     if (nextImage) {
      //       nextImage.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      //     }
      //   }
      // </script>

      <script>
        const imageElements = document.querySelectorAll('.image-container img');

        let currentIndex = 0;

        document.addEventListener('keydown', handleKeyDown);

        function handleKeyDown(event) {
          if (event.key === 'ArrowRight') {
            showNextImage();
          } else if (event.key === 'ArrowLeft') {
            showPrevImage();
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