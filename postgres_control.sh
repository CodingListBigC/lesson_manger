#!/bin/bash

PREFIX="/data/data/com.termux/files/usr/local/pgsql" # Define PREFIX for clarity

list_options() {
  echo "Available PostgreSQL Actions:"
  for i in "${!options[@]}"; do
    echo "$((i + 1)). ${options[$i]}"
  done
  echo ""
}

a=0 # Corrected variable assignment
aMax=1 # Corrected variable assignment

start() {
    if [ "$a" -eq 0 ]; then # Corrected conditional syntax
        sudo systemctl start postgresql
    elif [ "$a" -eq 1 ]; then # Corrected conditional syntax
        pg_ctl -D "$PREFIX/var/lib/postgresql" start # Added quotes for variable expansion
    else
        echo "No Function for this type"
    fi
}

stop() {
    if [ "$a" -eq 0 ]; then # Corrected conditional syntax
        sudo systemctl stop postgresql
    elif [ "$a" -eq 1 ]; then # Corrected conditional syntax
        pg_ctl -D "$PREFIX/var/lib/postgresql" stop # Added quotes for variable expansion
  else
        echo "No Function for this type"
    fi
}

status() {
    if [ "$a" -eq 0 ]; then # Corrected conditional syntax
        sudo systemctl status postgresql
    else
        echo "No Function for this type"
    fi
}

openDatabase() {
    if [ "$a" -eq 0 ]; then # Corrected conditional syntax
      sudo -u postgres psql lessonmanger # Corrected username and command
      echo "You are now connected to the 'lessonmanger' database as user 'postgres'. Type '\\q' to exit."
    elif [ "$a" -eq 1 ]; then # Corrected conditional syntax
      psql lesson_manger # Assuming 'lesson_manger' is the correct database name
    else
        echo "No Function for this type"
    fi
}

changeUsers() {
  if [ "$a" -eq "$aMax" ]; then # Corrected conditional syntax and variable expansion
      a=0 # Corrected variable assignment
  else
    a=$((a + 1)) # Corrected variable assignment and arithmetic expansion
  fi
  echo "User is now $a"
}
function createDatabase() {
    if [ "$a" -eq 0 ]; then # Corrected conditional syntax
        echo "Insert Function"
      elif [ "$a" -eq 1 ]; then # Corrected conditional syntax
        mkdir -p $PREFIX/var/lib/postgresql
initdb $PREFIX/var/lib/postgresql
    else
        echo "No Function for this type"
    fi

}
echo "choose an action: "
options=("Status" "Start" "Stop" "Connect to lessonmanger DB" "Create Database" "Change Users" "Exit") # Added "Change Users" to the options array

list_options # Call the function to display the options

select opt in "${options[@]}"; do
    case "$opt" in
        "Status")
            status
        ;;
        "Start")
            start
        ;;
        "Stop")
            stop
        ;;
        "Connect to lessonmanger DB")
            openDatabase
        ;;
        "Create Database")
            createDatabase
        ;;
        "Change Users") # Corrected case to match the option
            changeUsers
        ;;
        "Exit")
            break
        ;;
    *) echo "Invalid option. Please choose a number from the menu." ;;
    esac
done