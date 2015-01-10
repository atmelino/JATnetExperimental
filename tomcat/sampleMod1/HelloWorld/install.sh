#!/bin/bash

echo "make the dirs"

sudo mkdir /var/lib/tomcat7/webapps/ROOT/WEB-INF
sudo mkdir /var/lib/tomcat7/webapps/ROOT/WEB-INF/classes


echo "copy files"
sudo cp HelloWorld.class /var/lib/tomcat7/webapps/ROOT/WEB-INF/classes
sudo cp web.xml /var/lib/tomcat7/webapps/ROOT/WEB-INF

echo "ls"
ls /var/lib/tomcat7/webapps/ROOT/WEB-INF/classes
cat /var/lib/tomcat7/webapps/ROOT/WEB-INF/web.xml



echo press enter

read input

