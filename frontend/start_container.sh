#!/bin/bash

# Building the image
docker build -t react-app .

# Running the image
docker run -p 8080:80 react-app
