#!/bin/bash

set -e

bootstrapZip='bootstrap-3.0.0-dist.zip'
bootstrapFolder='bootstrap-3.0.0'

# cleanup
rm $bootstrapZip || true
rm -r $bootstrapFolder || true

# http://getbootstrap.com/
wget https://github.com/twbs/bootstrap/releases/download/v3.0.0/bootstrap-3.0.0-dist.zip

unzip -o $bootstrapZip -d $bootstrapFolder 

# css

origin=$bootstrapFolder'/dist/css/'
destiny='www/css/'
cp -v $origin'bootstrap.css' $destiny
cp -v $origin'bootstrap.min.css' $destiny

# fonts

origin=$bootstrapFolder'/dist/fonts/*'
destiny='www/fonts/'
cp -v $origin $destiny

# js

origin=$bootstrapFolder'/dist/js/'
destiny='www/js/libs/'
cp -v $origin'bootstrap.js' $destiny
cp -v $origin'bootstrap.min.js' $destiny

# cleanup
rm $bootstrapZip
rm -r $bootstrapFolder

echo 'Done!'

exit
#EOF
