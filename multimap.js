const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    "use strict";
    let mmap = client.getMultiMap('restaurants');

    mmap.put('New York', 'Red Lobster')
        .then(() => mmap.put('New York', 'Eataly'))
        .then(() => mmap.get('New York'))
        .then(list => console.log(list));

    mmap.put('Las Vegas', 'Burgr')
        .then(() => mmap.put('Las Vegas', 'Alibi'))
        .then(() => mmap.put('Las Vegas', 'Pub & Grill'))
        .then(() => mmap.get('Las Vegas'))
        .then(list => console.log(list));
});


