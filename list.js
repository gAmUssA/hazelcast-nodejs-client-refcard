const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient.newHazelcastClient().then((client) => {
    "use strict";
    let list = client.getList('my-distributed-list');

    let element = 'element1';
    list.add(element).then(() => {
        list.contains(element).then((result) => {
            console.log(`contains element1 - ${result}`);
        });
    });

    let elements = ['element2', 'element3'];
    list.addAll(elements).then(() => {
        list.containsAll(elements).then((result) => {
            console.log(`contains all element1 - ${result}`);
        })
    });
});