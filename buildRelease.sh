#!/bin/bash
npx react-native bundle --platform android --dev false --entry-file node_modules/expo/AppEntry.js --bundle-output android/app/src/main/assets/index.android.bundle
cd android
./gradlew assembleRelease