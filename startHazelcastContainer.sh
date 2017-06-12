#!/bin/sh

docker run -e JAVA_OPTS="-Dhazelcast.config=/configFolder/hazelcast.xml" -v $(pwd):/configFolder -ti -p 5701:5701 hazelcast/hazelcast:latest