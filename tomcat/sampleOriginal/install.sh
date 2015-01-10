#!/bin/bash

echo "ls before"
ls -la /var/lib/tomcat7/webapps

echo "copy file"
sudo cp sample.war /var/lib/tomcat7/webapps

echo "change mod"
sudo chmod 777 /var/lib/tomcat7/webapps/sample.war

echo "ls after"
ls -la /var/lib/tomcat7/webapps



echo press enter

read input

