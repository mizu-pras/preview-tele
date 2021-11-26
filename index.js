const express = require('express');
const path = require('path');
const fs = require("fs"); 
const app = express();

const port = process.env.PORT || 8080;
const indexPath  = path.join(__dirname, '/index.html');

// sendFile will go here
app.get('/', function(req, res) {
    const { url } = req.query

    const urlIgShare = url ? url : 'https://www.instagram.com/p/CWuUtDBpj7H'

    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        
        // inject meta tags
        htmlData = htmlData.replace(
            "<title>React App</title>",
            `<title>${'title'}</title>`
        )
        .replace('__META_OG_TITLE__', 'title')
        .replace('__META_OG_DESCRIPTION__', 'desc')
        .replace('__META_DESCRIPTION__', 'desc')
        .replace('__META_OG_IMAGE__', 'image')

        return res.send(htmlData);
    })
});

app.listen(port);
console.log('Server started at http://localhost:' + port);