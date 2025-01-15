#!/bin/bash

DEST="../../en/resources/contributing.md"

# This script replaces the contents of a section with the contents from
# the annotated source address.

# tracks the header level
level=''
# tracks repo & file for curl call
src=''
# tracks file for local file copy
local=''
while IFS= read -r line; do
  # this section removes prev lines after file loads - src/load set to non-empty 
  if [[ -n "$src" || -n "$local" ]]; then
    # line not a horitzontal rule hr
    if  [[ "$line" != "----"* ]]; then
    #  if line eq level - level is num of ##s
      if [[ "$line" == "$level"'#'*  ||
      # line not a header)
      "$line" != '#'* ]]; then
        continue
      fi
    fi
  fi

  src=''
  local=''
  # if line is header - assign level num
  if [[ "$line" == '#'* ]]; then
    # this is header before SRC/LOCAL anchors
    title=${line##*\#}
    level="${line:0:$((${#line} - ${#title}))}"
  # src on page 
  elif [[ "$line" == '<!-- SRC:'* ]]; then
    src=${line:10}
    src=${src% *}
  # local on page
  elif [[ "$line" == '<!-- LOCAL:'* ]]; then
    local=${line:12}
    local=${local% *}
    local=${local#* }
  fi 

  echo "$line"
 
  if [[ -n "$local" ]]; then
    cat "$local" | \
    # remove the top 1# headers from cat'd file
      sed -En '/^##|^[^#]/,$p' | \
      # remove GH specific tags staring w '[!NOTE\] and next line
      sed -E '/^>\[!NOTE\]*/{N;d}' | \
      # remove any lines with 'Not the Express JS Framework'
      sed -E '/Not the Express JS Framework/I,$d' | \
      # remove GH specific md tags
      sed -E 's/> \[!IMPORTANT\]/> **IMPORTANT:** /g'
      echo
  elif [[ -n "$src" ]]; then  
    echo
    path=${src#* }
    repo=${src% *}
    curl -s "https://raw.githubusercontent.com/${repo}/master/${path}" | \
      # if ## or not #
      sed -En '/^##|^[^#]/,$p' | \
      # add additional # every header 
      sed 's/^#/&'"${level:1}"'/g' | \
      # format gh links when match
      sed -E 's/(\[[^]]*\])\(([^):#]*)\)/\1(https:\/\/github.com\/'"$(sed 's/\//\\\//g' <<< "$repo")"'\/blob\/master\/\2)/g'
    echo
  fi
done <<<"$(< $DEST)" > $DEST
