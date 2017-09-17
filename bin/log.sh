#!/bin/bash

F=$HOME/Dropbox/Code/log
L=$F/log.js
T=$F/log.txt
TIME=$(date +"%H%M")
N=$(date +"%y%m%d%H%M")
D=$(printf '%x\n' $N)
C=$F/temp/cache.txt

addTime() {
  sed -i -e "s/undefined/$D/g" $1
}

cache() {
  echo "$1" >> $C
}

if [ $1 = "e" ]; then
  addTime $L
  addTime $T
  echo "END: $TIME"
  read -p "Have you accomplished what you set out to do? (y/n) " FIN
  if [ $FIN = "y" ]; then
    read -r TITLE < $C
    VERB=$(sed -n '2p' $C)
    WORD="$(echo $VERB | head -n1 | sed -e 's/\s.*$//')"
    TENSE="$(past $WORD)"
    NEW="$TENSE $(echo "$VERB" | cut -d " " -f2-)"
    rotonde w "$TITLE: $NEW"
    rm $C
  fi
  cd $F
  git add --all
  git commit -m "Log"
elif [ $1 = "p" ]; then
  echo "Push to master"
  cd $F
  git push -u origin master
elif [ $1 = "h" ]; then
  echo "Format: log {category} {title} {description}"
else
  DSC="$3"
  echo "$D  undefined  $1  $2  $DSC" >> $T
  sed -i '$d' $L
  printf "{\"s\":\"$D\",\"e\":\"undefined\",\"c\":\"$1\",\"t\":\"$2\",\"d\":\"$DSC\"},\n]" >> $L
  cache $2
  cache $DSC
  echo "START: $TIME"
fi
