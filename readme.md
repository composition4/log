# Log

This is a simple time-tracking and log system. Inspired by [osavox's](https://github.com/osavox/research.log)

Currently working on a dashboard to visualise the log data. Help lol.

## Mechanics
I use a shell script which updates my log files and, upon activity completion, commit them to this repository

## Usage
To start logging:
```
log {Category}
```
To end the activity:
```
log e
```

## log
```shell
#!/bin/bash

LOG=$HOME/Dropbox/Code/Projects/log/log.js
TXT=$HOME/Dropbox/Code/Projects/log/log.txt

NOW=$(date +"%y%m%d%H%M")
TIME=$(date +"%H%M")

LOGDATE=$(printf '%x\n' $NOW)

if [ $1 = "e" ]; then
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
  echo "$(date +"%y%m%d%H%M")  $TIME  undefined  $1  $TTL  $DSC" >> $TXT

  # update JS file
  sed -i '$d' $LOG
  printf "{\"n\":\"$LOGDATE\",\"s\":$TIME,\"e\":undefined,\"c\":\"$1\",\"t\":\"$TTL\",\"d\":\"$DSC\"},\n]" >> $LOG

  echo "Activity started. Remember to close this log."
fi
```
---
Josh Avanier

[![@joshavanier](https://joshavanier.github.io/badges/github.svg)](https://github.com/joshavanier)
[![@joshavanier](https://joshavanier.github.io/badges/twitter.svg)](https://twitter.com/joshavanier)
[![joshavanier.com](https://joshavanier.github.io/badges/website.svg)](https://joshavanier.com)
