const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Render the HTML page with image tags
app.get('/', (req, res) => {
  const imageFiles = getImageFiles('images');
  const imageTags = imageFiles.map(file => `<img src="/images/${file}" alt="${file}">`).join('');
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Gallery</title>
      <style>
        img {
          display: block;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      ${imageTags}
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