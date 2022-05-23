#!/bin/bash

# Powinno być wykonane z katalogu głównego 'yummy', a nie z jakiegoś podkatalogu.
if ! [[ "$PWD" =~ yummy$ ]]; then
    echo " - Run me from the 'public_html' level please.";
    exit 1;
fi;

echo ' - Doing git pull'
git pull 

# Commit message, o ile w ogóle: 
commitMessage='';
while getopts 'm:' opt; do
	if [[ $opt == 'm' ]]; then
		commitMessage="${OPTARG}"; 
	fi;	
done;

# Kompresja plus manglowanie js.
echo " - Compressing js file(s)"
terser --compress --mangle --output ./html/app/dist/app.js -- ./html/app/src/app.js

# Jeśli zapodany parametr -m
if [ ! -z "$commitMessage" ]
then
      echo " - Doing git add & commit"
      git add .
      git commit -m "$commitMessage"
else
      echo " - Ommiting git commit"
fi

echo " - Doing git push"
git push origin master

echo " - Doing git pull on remote"
ssh admin@185.243.53.216 'cd /var/www/akimaki/yummy;git pull origin master' 

echo " - Deleting unnecessary files on remote (if any)"
ssh admin@185.243.53.216 'cd /var/www/akimaki/yummy;rm -f ./html/app/src/app.js' 