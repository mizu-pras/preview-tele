const express = require('express');
const path = require('path');
const fs = require("fs"); 
const app = express();
const axios = require('axios')

const port = process.env.PORT || 8080;
const indexPath  = path.join(__dirname, '/index.html');

// sendFile will go here
app.get('/', async (req, res) => {
    const { url } = req.query

    const urlIgShare = url ? url : 'https://www.instagram.com/p/CWuUtDBpj7H/?utm_medium=share_sheet'

    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {

        try {
        
            const userInfoSource = await axios.get(urlIgShare)
    
            // userInfoSource.data contains the HTML from Axios
            const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
    
            const userInfo = JSON.parse(jsonObject)
            
            const data = userInfo.entry_data.PostPage[0].graphql.shortcode_media
    
            const image = data.display_url
            const title = data.accessibility_caption
            const description = data.edge_media_to_caption.edges[0].node.text

            // inject meta tags
            htmlData = htmlData.replace(
                "<title>React App</title>",
                `<title>${title}</title>`
            )
            .replace('__META_OG_TITLE__', title)
            .replace('__META_OG_DESCRIPTION__', description)
            .replace('__META_DESCRIPTION__', description)
            .replace('__META_OG_IMAGE__', image)
    
        } catch (e) {
            return res.send(e)
        }

        return res.send(htmlData);
    })
});

app.get('/ig', async (req, res) => {
    let response = {}

    try {
        
        const userInfoSource = await axios.get('https://www.instagram.com/p/CWuUtDBpj7H/?utm_medium=share_sheet')

        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        
        const data = userInfo.entry_data.PostPage[0].graphql.shortcode_media

        response.image = data.display_url
        response.title = data.accessibility_caption
        response.description = data.edge_media_to_caption.edges[0].node.text

    } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
    }

    return res.send(response)
})

app.listen(port);
console.log('Server started at http://localhost:' + port);