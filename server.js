import './plugin/node-polyfill'
import Inferno from 'inferno';
import {
    renderToString,
    streamQueueAsString,
    renderToStaticMarkup,
    RenderStream
} from 'inferno-server'
import { RouterContext, match } from 'inferno-router';
import express from 'express';
import routes from './src/configs/serverRoutes';
import './plugin/common/framework'

var https = require('http'),
    fs = require('fs');
var layout = fs.readFileSync('../index.html', 'utf8')
function Html({children}) {
    return (<div id="app">{children}</div>);
}

const app = express();

var mime = ["htm", "html", "jpeg", "jpg", "png", "gif", "js", "css", "woff", "otf", "ttf", "eot", "svg"];

app.use((req, res) => {
    if (/\.ico$/.test(req.originalUrl)) return res.send('');
    else if (/.(htm|html|jpeg|jpg|png|gif|js|css|woff|otf|ttf|eot|svg)$/.test(req.originalUrl))
        return res.redirect('http://127.0.0.1:20003' + req.originalUrl);
    const renderProps = match(routes, req.originalUrl);
    if (renderProps.redirect) {
        return res.redirect(renderProps.redirect)
    }
    const content = (<Html><RouterContext {...renderProps}/></Html>);
    res.send(layout.replace('<div id="app"></div>', renderToString(content)));
});

https.createServer(app).listen(30001, function () {
    console.log(
        'node web server connection successfully Express server listening on port 30001 !'
    );
});