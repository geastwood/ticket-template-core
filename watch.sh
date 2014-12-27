#!/bin/bash

clear
echo "watching $(pwd) => make test"
fswatch -o . | xargs -n 1 -I {} make test
