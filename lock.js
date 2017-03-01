const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    let lock = client.getLock('my-distributed-lock');

    lock.lock().then(() => {
        // do something
    });

    lock.unlock();
});