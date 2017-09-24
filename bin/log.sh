#!/bin/bash

F=$HOME/Dropbox/Code/log
L=$F/log.js
T=$F/log.txt
TIME=$(date +"%H%M")
N=$(date +"%y%m%d%H%M")
D=$(printf '%x\n' $N)
C=$F/temp/cache.txt
R=$HOME/.config/rotonde/rotonde.json
J=$HOME/Dropbox/Code/joshavanier.github.io/rotonde
JI=$J/index.html
JR=$J/rotonde.json

addTime() {
  sed -i -e "s/undefined/$D/g" $1
}

cache() {
  echo "$1" >> $C
}

rotonde() {

  cd $HOME/Dropbox/Code/rotonde-cli
  ./rotonde write "$1" > /dev/null

  cd $HOME/Dropbox/Code/joshavanier.github.io
  rm $JI
  rm $JR
  cat $R >> $JI
  cat $R >> $JR

  git add rotonde/index.html rotonde/rotonde.json > /dev/null
  git commit -m "Update Rotonde" > /dev/null

  echo "Rotonde updated"

}

if [ $1 = "e" ]; then
  echo "Ending log..."

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

    rotonde "$TITLE: $NEW"
  fi

  rm $C
  cd $F

  git add log.txt log.js > /dev/null
  git commit -m "Log" > /dev/null

  echo "Log updated"
elif [ $1 = "p" ]; then

  echo "Push to master"

  cd $F
  git push -u origin master > /dev/null

  cd $HOME/Dropbox/Code/joshavanier.github.io
  git push -u origin master > /dev/null

elif [ $1 = "h" ]; then

  echo "Format: log {category} {title} {description}"

else

  DSC="$3"

  echo "$D  undefined  $1  $2  $DSC" >> $T

  sed -i '$d' $L
  printf "{\"s\":\"$D\",\"e\":\"undefined\",\"c\":\"$1\",\"t\":\"$2\",\"d\":\"$DSC\"},\n]" >> $L

  cache "$2"
  cache "$DSC"
  echo "START: $TIME"

fi
