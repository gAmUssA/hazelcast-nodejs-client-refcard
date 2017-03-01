const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    let map = client.getMap('my-distributed-map');
    map.put("key", "value")
        .then(() => map.get("key"))
        .then(() => map.putIfAbsent("somekey", "somevalue"))
        .then(() => map.replace("key", "oldvalue", "newvalue"))

});