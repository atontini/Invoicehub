#!/bin/bash

# Building the image
docker build -t flask-app .

# Running the image
docker run -d -p 5000:5000 --name flask-app-container flask-app