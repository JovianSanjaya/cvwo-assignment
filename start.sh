#!/bin/bash

cleanup() {
    kill $(jobs -p)
}

trap cleanup EXIT

echo "Starting Backend..."
cd backend && go run main.go &

echo "Starting Frontend..."
cd frontend && npm run dev
