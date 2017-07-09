#!/bin/bash

LOG=$HOME/Dropbox/Code/Projects/log/log.js
TXT=$HOME/Dropbox/Code/Projects/log/log.txt

NOW=$(date +"%y%m%d%H%M")
TIME=$(date +"%H%M")

LOGDATE=$(printf '%x\n' $NOW)

if [ $1 = "end" ]; then
  sed -i -e "s/undefined/$TIME/g" $LOG
  sed -i -e "s/undefined/$TIME/g" $TXT
  echo "Activity ended."

  cd $HOME/Dropbox/Code/Projects/log
  git add --all
  git commit -m "Update log"
  git push -u origin master
else
  read -p "Title: " TTL
  read -p "Description: " DSC

  # update txt file
  echo "$LOGDATE  $TIME  undefined  $1  $TTL  $DSC" >> $TXT

  # update JS file
  sed -i '$d' $LOG
  printf "{\"n\":\"$LOGDATE\",\"s\":$TIME,\"e\":undefined,\"c\":\"$1\",\"t\":\"$TTL\",\"d\":\"$DSC\"},\n]" >> $LOG

  echo "Activity started. Remember to close this log."
fi
