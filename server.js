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

var https = require('http');

function Html({children}) {
    return (
        <html>
        <head>
            <title>My Application</title>
        </head>
        <body>
        <div id="app">{children}</div>
        </body>
        </html>
    );
}

const app = express();

app.use((req, res) => {
    if (/\.ico$/.test(req.originalUrl)) return res.send('');
    const renderProps = match(routes, req.originalUrl);
    if (renderProps.redirect) {
        return res.redirect(renderProps.redirect)
    }
    const content = (<Html><RouterContext {...renderProps}/></Html>);
    console.log(<RouterContext {...renderProps}/>);
    res.send('<!DOCTYPE html>\n' + renderToString(content));
});

https.createServer(app).listen(30001, function () {
    console.log(
        'node web server connection successfully Express server listening on port 30001 !'
    );
});