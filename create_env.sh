#!/bin/bash
cd backend
python -m venv venv
. venv/bin/activate
pip install flask flask-sqlalchemy flask-login