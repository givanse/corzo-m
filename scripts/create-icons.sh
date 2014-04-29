#!/bin/bash

#
# Generate all the icon sizes from a single PNG file.
#
# Dependency:
#     sudo apt-get install imagemagick
#
# Usage examples:
#     ./scripts/create-icons.sh www/img/tlol.png
#

set -e

original_icon_file=$1
echo $original_icon_file

create_icon() {
    size=$1
    destination=$2
    convert -verbose $original_icon_file -resize $size $destination
}

# Platform icons

# platform - android
icons_path_android='platforms/android/res/'
create_icon 96 $icons_path_android'drawable/icon.png'
create_icon 72 $icons_path_android'drawable-hdpi/icon.png'
create_icon 36 $icons_path_android'drawable-ldpi/icon.png'
create_icon 48 $icons_path_android'drawable-mdpi/icon.png'
create_icon 96 $icons_path_android'drawable-xhdpi/icon.png'

# platform - ios

# Phonegap build

create_icon 128 'www/icon.png'

# phonegap - android
# phonegap - ios

exit
#EOF
