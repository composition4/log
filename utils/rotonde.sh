#!/bin/bash

L=$HOME/Dropbox/Code/rotonde-cli

if [ $1 = "w" ]; then
  cd $L
  ./rotonde write "$2"
fi
