#!/bin/sh
rm -rf out
mkdir out

for file in src/*; do
    out_file=$(basename $file | sed -e 's/\.js/\.min\.js/g')
    ./node_modules/uglify-js/bin/uglifyjs $file -o out/$out_file
done

cp vendor/* out/
cp video_overlay.html out/
cp video_overlay_style.css out/
cp -r img out/

cd out
zip -r out.zip *
cd ..
mv out/out.zip out.zip
