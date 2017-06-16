var logger = require('./log');

/**
 * uniform exception handler
 * @type {Object}
 */
module.exports = {
    /**
     * generated the uniform error model
     * @param  {object} err the error from any operator from server.
     * @return {object}     error model
     */
    getErrorModel: function(err) {
        logger.debug("getErrorModel-> err:", err);
        var _error = {
            status: err.status || 500,
            message: err.message || '',
            stack: err.stack || JSON.stringify(err)
        };
        return {
            failed: true,
            error: _error
        };
    },
    /**
     * Exposed uniform api json response data result structure
     * @param  {object} res   response
     * @param  {object} err err object
     * @return {json}         output json result to client.
     */
    writeJSONError: function(res, err) {
        logger.debug("writeJSONError-> err:", err);
        var status = err.status || 500;
        var message = err.message || "The request internal exception!";
        res.json(status, {
            resultCode: status,
            resultMsg: message
        });
    }
}
