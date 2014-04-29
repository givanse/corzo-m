#!/bin/bash

set -e

bootstrapZip='bootstrap-3.0.0-dist.zip'
bootstrapFolder='bootstrap-3.0.0'

# cleanup
rm $bootstrapZip
rm -r $bootstrapFolder

# http://getbootstrap.com/
wget https://github.com/twbs/bootstrap/releases/download/v3.0.0/bootstrap-3.0.0-dist.zip

unzip -o $bootstrapZip -d $bootstrapFolder 

# css

origin=$bootstrapFolder'/dist/css/'
destiny='www/css/'
cp -v $origin'bootstrap.css' $destiny
cp -v $origin'bootstrap.min.css' $destiny

# js

origin=$bootstrapFolder'/dist/js/'
destiny='www/js/'
cp -v $origin'bootstrap.js' $destiny
cp -v $origin'bootstrap.min.js' $destiny

# cleanup
rm $bootstrapZip
rm -r $bootstrapFolder

exit
#EOF
