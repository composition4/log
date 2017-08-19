#!/bin/bash

F=$HOME/Dropbox/Code/log
L=$F/log.js
T=$F/log.txt

TIME=$(date +"%H%M")

s() {
  N=$(date +"%y%m%d%H%M")
  D=$(printf '%x\n' $N)

  read -p "Title: " TTL
  read -p "Description: " DSC

  echo "$(date +"%y%m%d%H%M")  $TIME  undefined  $1  $TTL  $DSC" >> $T

  sed -i '$d' $L
  printf "{\"n\":\"$D\",\"s\":$TIME,\"e\":undefined,\"c\":\"$1\",\"t\":\"$TTL\",\"d\":\"$DSC\"},\n]" >> $L

  echo "LOG START: $TIME"
}

e() {
  sed -i -e "s/undefined/$TIME/g" $L
  sed -i -e "s/undefined/$TIME/g" $T
  echo "LOG END: $TIME"
  git add --all
  git commit -m "Log"
}

p() {
  cd $F
  git push -u origin master
}

if [ $1 = "e" ]; then e
elif [ $1 = "p" ]; then p
else s
fi
