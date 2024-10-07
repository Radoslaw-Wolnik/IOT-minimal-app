#!/bin/bash

set -e

function start_dev {
    echo "Starting development environment..."
    docker-compose up -d db
    (cd backend && npm run dev) &
    (cd frontend && npm start)
}

function build {
    echo "Building project..."
    (cd backend && npm run build)
    (cd frontend && npm run build)
}

function test {
    echo "Running tests..."
    (cd backend && npm test)
    (cd frontend && npm test)
}

function deploy {
    echo "Deploying project..."
    docker-compose up --build -d
}

function usage {
    echo "Usage: $0 [dev|build|test|deploy]"
    exit 1
}

case "$1" in
    dev)
        start_dev
        ;;
    build)
        build
        ;;
    test)
        test
        ;;
    deploy)
        deploy
        ;;
    *)
        usage
        ;;
esac