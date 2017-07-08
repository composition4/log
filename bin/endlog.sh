#!/bin/bash

LOG=$HOME/Dropbox/Code/Projects/log/log.txt
NOW=$(date +"%H%M")

sed -i -e "s/{END}/$NOW/g" $LOG
echo "Activity ended."

cd $HOME/Dropbox/Code/Projects/log
git add --all
git commit -m "Update log"
git push -u origin master
