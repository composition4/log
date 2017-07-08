## Log
This is a simple time-tracking and log system. Inspired by [osavox's](https://github.com/osavox/research.log)

### Mechanics
I use two shell scripts: one to start the log and another to end the log and update this GitHub repository

### Usage
To start logging:
```
timelog {Category}
```
To end the activity:
```
endlog
```

### timelog
```shell
LOG=$HOME/Dropbox/Code/Projects/log/log.txt
NOW=$(date +"%Y%m%d")
TIME=$(date +"%H%M")

read -p "Name: " name
read -p "Desc: " description

echo "$NOW  $TIME  {END}  $1  $name  $description" >> $LOG

echo "Activity started. Remember to close this log."
```

### endlog
```shell
LOG=$HOME/Dropbox/Code/Projects/log/log.txt
NOW=$(date +"%H%M")

sed -i -e "s/{END}/$NOW/g" $LOG
echo "Activity ended."

cd $HOME/Dropbox/Code/Projects/log
git add --all
git commit -m "Update log"
git push -u origin master
```
