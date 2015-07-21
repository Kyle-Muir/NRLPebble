var LoggingModule = (function() {
    function log(item, message) {
        console.log('message: ' + message + ', object as JSON: ' + JSON.stringify(item));
    }
    return {
        log: log
    };
})();
module.exports = LoggingModule;
