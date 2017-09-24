#!/bin/bash

if [[ "$1" == *ing ]]; then
  if [[ "$1" == Writing ]]; then echo "Wrote";
  elif [[ "$1" == Reading ]]; then echo "Read";
  elif [[ "$1" == Learning ]]; then echo "Learnt";
  elif [[ "$1" == Doing ]]; then echo "Did";
  elif [[ "$1" == Making ]]; then echo "Made";
  elif [[ "$1" == Setting ]]; then echo "Set";
  elif [[ "$1" == Spending ]]; then echo "Spent";
  elif [[ "$1" == Drawing ]]; then echo "Drew";
  elif [[ "$1" == Building ]]; then echo "Built";
  else
    echo "$(echo $1 | rev | cut -c 4- | rev)ed"
  fi
else
  echo "Verbs in -ing form only please"
fi
