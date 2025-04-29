#!/bin/bash

list_options() {
  echo "Available PostgreSQL Actions:"
  for i in "${!options[@]}"; do
    echo "$((i + 1)). ${options[$i]}"
  done
  echo ""
}

PS3="Choose an action: "
options=("Status" "Start" "Stop" "Connect to lessonmanger DB" "Exit")

list_options # Call the function to display the options

select opt in "${options[@]}"; do
  case "$opt" in
  "Status")
    sudo systemctl status postgresql
    ;;
  "Start")
    sudo systemctl start postgresql
    ;;
  "Stop")
    sudo systemctl stop postgresql
    ;;
  "Connect to lessonmanger DB")
    sudo -u postgres psql lessonmanger
    echo "You are now connected to the 'lessonmanger' database as user 'postgres'. Type '\\q' to exit."
    ;;
  "Exit")
    break
    ;;
  *) echo "Invalid option. Please choose a number from the menu." ;;
  esac
done
