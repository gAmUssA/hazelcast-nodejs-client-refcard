const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;
let listener = require('./listener');

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient(config).then((client) => {
    let map = client.getMap('my-distributed-map');
    map.addEntryListener(listener, undefined, true)
        .then(() => map.put('key', 'value'))
        .then(() => map.get('key'))
        .then(() => map.putIfAbsent('somekey', 'somevalue'))
        .then(() => map.replace('key', 'somevalue', 'newvalue'))
        .then(() => map.remove('key'))
    ;
});