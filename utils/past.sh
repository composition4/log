#!/bin/bash

W=$1

if [[ "$W" == *ing ]]; then
  if [[ "$W" == Writing ]]; then echo "Wrote";
  elif [[ "$W" == Reading ]]; then echo "Read";
  elif [[ "$W" == Learning ]]; then echo "Learnt";
  elif [[ "$W" == Doing ]]; then echo "Did";
  elif [[ "$W" == Making ]]; then echo "Made";
  elif [[ "$W" == Setting ]]; then echo "Set";
  elif [[ "$W" == Spending ]]; then echo "Spent";
  elif [[ "$W" == Drawing ]]; then echo "Drew";
  elif [[ "$W" == Building ]]; then echo "Built";
  else
    echo "$(echo $1 | rev | cut -c 4- | rev)ed"
  fi
else
  echo "Verbs in -ing form only please"
fi
