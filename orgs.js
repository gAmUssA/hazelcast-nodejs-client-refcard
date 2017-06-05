const express = require('express');
const request = require('superagent');
const Promise = require('bluebird');
const PORT = process.env.PORT || 3000;
const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;


let config = new Config.ClientConfig();
config.networkConfig.addresses = [{host: '127.0.0.1', port: '5701'}];
let ncc = new Config.NearCacheConfig();
ncc.invalidateOnChange = true;
ncc.name='github-orgs';
let ncConfigs = [];
ncConfigs.push(ncc);
config.nearCacheConfigs = ncConfigs;

let orgCache;
let orgMultiMap;

HazelcastClient.newHazelcastClient(config).then((client) => {
    console.log(config);
    orgCache = client.getMap('github-orgs');
    orgMultiMap = client.getMultiMap('github-orgs');
    const app = express();

    app.get('/repos', cache, getNumberOfRepos);

    app.listen(PORT, function () {
        console.log('app listening on port', PORT);
    });
});

function respond(org, numberOfRepos) {
    return `Organization "${org}" has ${numberOfRepos} public repositories`;
}

function cache(req, res, next) {
    const org = req.query.org;

    console.time('cache');
    orgCache.get(org).then((data) => {
        if (data !== null) {
            console.timeEnd('cache');
            res.send(respond(org, JSON.parse(data).length));
        } else {
            next();
        }
    });
}

function getNumberOfRepos(req, res, next) {
    const org = req.query.org;
    request.get(`https://api.github.com/orgs/${org}/repos?per_page=100`, function (err, response) {
        if (err) {
            throw err;
        }
        let body = response.body;
        let repoNumber = 0;
        if (response && body) {
            repoNumber = body.length;
            let putIfAbsentPromise = orgCache.putIfAbsent(org, JSON.stringify(body));
            Promise.resolve(putIfAbsentPromise)
                .then(() => {
                    res.send(respond(org, repoNumber));
                });
        }
    });
}


