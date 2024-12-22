#!/bin/bash
. backend/venv/bin/activate
export FLASK_APP=backend
export FLASK_DEBUG=1
flask run