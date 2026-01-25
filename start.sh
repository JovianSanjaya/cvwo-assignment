#!/bin/bash
#this script is used to test for local dev 

echo "Starting backend and frontend..."

# Start backend
cd backend

# Start frontend
cd ../frontend
npm run dev
