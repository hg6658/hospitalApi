import NodeCache from "node-cache";

interface NodeCacheObj{
    nodeCache:NodeCache
}

let obj:NodeCacheObj = {
    nodeCache: new NodeCache(),
}

export = obj;
