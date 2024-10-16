# Vue Player

## Demo

You can access the project [here](https://prsevero.com.br/vue-player/).

## IMPORTANT

The project contains proprietary music that has been rightfully provided by the authors. I obtained written consent from the artists, who are friends from my hometown, to include it in the project. I thought their music would be a fantastic addition. You can check out more of their awesome work on [SoundCloud](https://soundcloud.com/nocet).

## Overview

This project utilizes the Vue.js framework with the Composition API and Pinia for state management. It includes the following features:

- **Player**: Users can easily control playback with play/pause, rewind, forward, and stop buttons. By interacting with the info section or the expand button, users can view more details about the song. The player also displays the current and total time of the song, along with a progress slider that allows users to seek within the track.
- **Album View**: Users can explore album details on a dedicated page. This includes the album's name, artist, cover, and a list of songs. Songs can be played directly from this list, and users can view the credits for the currently playing track.

## Planned Improvements

- Create a dedicated view for the currently playing song
- Add random and repeat features
- Add loop functionality (with options for no loop, loop song, or loop playlist)
- Allow users to create custom playlists
- Add a favorites feature
- Add a search function
- Enable volume control within the app
- Implement tests

## Architecture

- `assets`: (S)CSS files used in the project
- `components`: UI SFC components
- `shared`: Global application files (constants, type definitions, and utilities)
- `stores`: Pinia stores for state management

## Stack

- [Vue.js](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)

## Scripts and Commands

- `install` - Install dependencies
- `dev` - Compile and start the dev server
- `lint` - Run ESLint to check for code issues
- `build` - Type-check, compile, and minify for production

## Credits

Special thanks to [Bensound](https://www.bensound.com/) and [Benjamin Tissot](https://www.bensound.com/royalty-free-music?composer=84) for providing royalty-free music for the project.

Icons from the [Solar Bold](https://www.svgrepo.com/collection/solar-bold-icons) collection were used.

A huge thank you to the band [Nocet](https://soundcloud.com/nocet) for allowing me to feature their amazing songs in this project. Please check out their work - they are truly fantastic!

## Support

If you have any questions or need assistance, feel free to reach out. I'm happy to help, just ping me!
