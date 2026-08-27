The LatticeXR APK for Quest 3 is NOT served from this web repo
(it exceeds the Vercel deploy limit: ~402 MB).

Publish it as a Release on the Unity repo:

  https://github.com/santiagovianadno/LATTICEXR

From the Unity project folder (or any shell with gh auth):

  gh release create v0.999 "LatticeXRv0.999.apk" ^
    -R santiagovianadno/LATTICEXR ^
    --title "LatticeXR v0.999" ^
    --notes "Beta build for Meta Quest 3"

The website button points to:

  https://github.com/santiagovianadno/LATTICEXR/releases/latest/download/LatticeXRv0.999.apk
