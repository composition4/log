#!/bin/bash

LOG=$HOME/Dropbox/Code/Projects/log/log.txt

NOW=$(date +"%Y%m%d")
TIME=$(date +"%H%M")

read -p "Name: " name
read -p "Desc: " description

echo "$NOW  $TIME  {END}  $1  $name  $description" >> $LOG

echo "Activity started. Remember to close this log."
