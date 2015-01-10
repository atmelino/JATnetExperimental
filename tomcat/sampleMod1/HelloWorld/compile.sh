#!/bin/bash


echo "compiling:"

#javac -cp /usr/share/java/tomcat-api-7.0.52.jar -target 1.7 HelloWorld.java



javac -cp /usr/share/java/servlet-api-3.0.jar -source 1.7 -target 1.7 HelloWorld.java


echo press enter

read input

