const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    let queue = client.getQueue('my-distributed-queue');

    queue.offer('item');
    queue.poll().then(item => console.log(item));

    queue.offer('anotheritem', 500);
    queue.poll(5000).then(item => console.log(item));

    queue.offer('yetanotheritem');
    queue.take().then(item => console.log(item));

});