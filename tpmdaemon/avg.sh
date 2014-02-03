#!/bin/bash

clear
echo "Ready to do some damage..."

TAG=$1
FILE=$2
echo "Ta-da! The average for '$TAG' in '$FILE' is" $(grep $1 $2 | cut -d '|' -f3 | tr -d ' ' | awk 'a += $1 {print a/NR}' | tail -1)