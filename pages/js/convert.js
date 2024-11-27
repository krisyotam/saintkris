const fs = require('fs');
const path = require('path');

// The function that converts JSON content to HTML
function convertJsonToHtml(jsonContent) {
    const metadata = jsonContent.metadata;
    const content = jsonContent.content;

    // Construct the table of contents from sections
    let tableOfContents = '';
    content.forEach(section => {
        tableOfContents += `<li><a href="#${section.section.toLowerCase().replace(/\s+/g, '-')}" class="toc-section">${section.section}</a></li>`;
        section.subsections.forEach(subsection => {
            tableOfContents += `<li><a href="#${subsection.title.toLowerCase().replace(/\s+/g, '-')}" class="toc-subsection">- ${subsection.title}</a></li>`;
        });
    });

    // Construct the post body content
    let postContent = '';
    content.forEach(section => {
        postContent += `<h2 id="${section.section.toLowerCase().replace(/\s+/g, '-')}" class="section-title">${section.section}</h2>`;
        section.subsections.forEach(subsection => {
            postContent += `<h3 id="${subsection.title.toLowerCase().replace(/\s+/g, '-')}" class="subsection-title">${subsection.title}</h3>`;
            postContent += `<p>${subsection.content}</p>`;
        });
    });

    // Return the final HTML structure
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${metadata.title}</title>
        <link rel="stylesheet" href="/pages/css/style.css">
        <link rel="stylesheet" href="/pages/css/post.css">
    </head>
    <body>
    <header class="header">
      <nav class="nav">
        <div class="nav-buttons">
          <button class="nav-button" onclick="window.location.href='/index.html'">Home</button>
          <button class="nav-button" onclick="window.location.href='/pages/html/about.html'">About</button>
        </div>
        <h1 class="title">KRIS YOTAM</h1>
        <div class="nav-buttons">
          <button class="nav-button" onclick="window.location.href='/pages/html/topics.html'">Topics</button>
          <button class="nav-button" onclick="window.open('https://krisyotam-xyz.vercel.app/pages/html/contact.html', '_blank')">Contact</button>
        </div>
      </nav>
    </header>

        <div class="content-wrapper">
            <div class="post-container">
                <h2 class="post-title">${metadata.title}</h2>
                <div class="post-meta">By ${metadata.name} on ${metadata.date}</div>
                <div class="post-body">
                    ${postContent}
                </div>
            </div>
            
            <div class="sidebar-container">
                <div class="table-of-contents">
                    <h3>Table of Contents</h3>
                    <ul>
                        ${tableOfContents}
                    </ul>
                </div>
            </div>
        </div>

        <div class="footerdiv">
            <footer class="footer">
                <a href="https://x.com/krisyotam" class="source-link">Kris Yotam (@krisyotam)</a>
                <a href="https://github.com/krisyotam" class="source-link">Source</a>
            </footer>
        </div>

        <script src="/pages/js/script.js"></script>
    </body>
    </html>
    `;
}

// Absolute file paths for JSON input and HTML output
const postsDir = 'C:\\Users\\Kris Yotam\\Documents\\Websites\\judahkris\\pages\\html\\posts\\json'; // Absolute path to the folder for .json files
const outputDir = 'C:\\Users\\Kris Yotam\\Documents\\Websites\\judahkris\\pages\\html\\posts\\html'; // Absolute path to the folder for .html files


// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the files in the JSON directory
fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading the directory', err);
        return;
    }

    // Filter out non-JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Convert each JSON file to HTML
    jsonFiles.forEach(file => {
        const jsonFilePath = path.join(postsDir, file);
        const htmlFilePath = path.join(outputDir, file.replace('.json', '.html'));

        // Read the JSON content
        fs.readFile(jsonFilePath, 'utf-8', (err, jsonData) => {
            if (err) {
                console.error('Error reading JSON file', err);
                return;
            }

            // Parse the JSON content
            let jsonContent;
            try {
                jsonContent = JSON.parse(jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON', parseError);
                return;
            }

            // Convert the JSON content to HTML
            const htmlContent = convertJsonToHtml(jsonContent);

            // Write the HTML content to a new file
            fs.writeFile(htmlFilePath, htmlContent, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing HTML file', err);
                    return;
                }
                console.log(`Converted ${file} to HTML`);
            });
        });
    });
});
