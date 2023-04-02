(function(){
    const NodeCache = require("node-cache");

    module.exports = {
        nodeCache: new NodeCache(),
    }
})();
