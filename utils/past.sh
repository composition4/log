#!/bin/bash

W=$1

if [[ "$W" == *ing ]]; then
  if [[ "$W" == Writing ]]; then echo "wrote";
  elif [[ "$W" == Reading ]]; then echo "read";
  elif [[ "$W" == Learning ]]; then echo "learnt";
  elif [[ "$W" == Doing ]]; then echo "did";
  elif [[ "$W" == Making ]]; then echo "made";
  elif [[ "$W" == Setting ]]; then echo "set";
  elif [[ "$W" == Spending ]]; then echo "spent";
  elif [[ "$W" == Drawing ]]; then echo "drew";
  else
    echo "$(echo $1 | rev | cut -c 4- | rev)ed"
  fi
else
  echo "Verbs in -ing form only please"
fi
