#!/bin/bash

set -e

emberzip='v1.5.1.zip'
emberkit='starter-kit-1.5.1'

# cleanup
rm $emberzip
rm -r $emberkit

# http://emberjs.com/
wget https://github.com/emberjs/starter-kit/archive/v1.5.1.zip

unzip $emberzip

cp -v $emberkit'/css/normalize.css' 'www/css/'
cp -vR $emberkit'/js/libs/' 'www/js'

# cleanup
rm $emberzip
rm -r $emberkit

exit
#EOF
