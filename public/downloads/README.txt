El APK de LatticeXR para Quest 3 NO se sirve desde este repo web
(pasa el límite de despliegue de Vercel: ~402 MB).

Publícalo como Release en el repo Unity:

  https://github.com/santiagovianadno/LATTICEXR

Desde la carpeta del proyecto Unity (o cualquier shell con gh auth):

  gh release create v0.999 "LatticeXRv0.999.apk" ^
    -R santiagovianadno/LATTICEXR ^
    --title "LatticeXR v0.999" ^
    --notes "Build beta para Meta Quest 3"

El botón de la web apunta a:

  https://github.com/santiagovianadno/LATTICEXR/releases/latest/download/LatticeXRv0.999.apk
