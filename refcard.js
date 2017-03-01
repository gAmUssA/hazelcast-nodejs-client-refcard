const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;

let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];

HazelcastClient
    .newHazelcastClient().then((client) => {
    let map = client.getMap('my-distributed-map');
    let queue = client.getQueue('my-distributed-queue');
    let lock = client.getLock('my-distributed-lock');
    let ringBuffer = client.getRingbuffer('my-distributed-ringbuffer');
    let topic = client.getReliableTopic('my-distributed-topic');
    mapExample(map);
    queueExample(queue);
    lockExample(lock);
    topicExample(topic);
    // TODO RingBuffer
    listenerExample(map);

});

let mapExample = (map) => {
    "use strict";
    map.put("key", "value")
        .then(() => map.get("key"))
        .then(() => map.putIfAbsent("somekey", "somevalue"))
        .then(() => map.replace("key", "oldvalue", "newvalue"))
};

let queueExample = (queue) => {
    queue.offer('item');
    queue.poll().then(item => console.log(item));

    queue.offer('anotheritem', 500);
    queue.poll(5000).then(item => console.log(item));

    queue.offer('yetanotheritem');
    queue.take().then(item => console.log(item));
};

let lockExample = (lock) => {
    "use strict";
    lock.lock().then(() => {
        // do something
    });

    lock.unlock();
};
let topicExample = (topic) => {
    "use strict";
    topic.addMessageListener((msg) => {
        console.log(msg.messageObject);
    });
    topic.publish("hello from distributed world");
};

let listenerExample = (map) => {
    "use strict";
    let listener = {
        added: (key, oldValue, value, mergingValue) => {
            console.log(value)
        }
    };
    map.addEntryListener(listener, undefined, true).then(() => {
        map.put("key1", "value");
    });


};