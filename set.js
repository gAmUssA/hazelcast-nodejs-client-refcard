const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    "use strict";
    let set = client.getSet('my-distributed-set');

    let elements = ['duplicate', 'duplicate', 'duplicate'];
    set.addAll(elements).then(() => {
        set.getAll().then((result) => {
            //look, ma, no duplicates
            console.log(result);
        })
    });
});