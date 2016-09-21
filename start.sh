#!/bin/bash

#	http://stackoverflow.com/questions/300669/launch-app-capture-stdout-and-stderr-in-c


while [ `node server.js >> journal.log 2>&1` ]
do
echo "restart app after crash"
done

killall node