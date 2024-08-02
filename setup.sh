#!/bin/bash

# Install frontend dependencies
npm install

# Build the frontend
npm run build

# Install backend dependencies
pip install -r api/requirements.txt