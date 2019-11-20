const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')

const port = (process.env.PORT || 3000);


// Serve up public folder
const serve = serveStatic(__dirname + '/public', { 'index':false })

// Create server
const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(port)
