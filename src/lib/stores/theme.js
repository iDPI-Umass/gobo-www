import { writable } from "svelte/store";
import { browser } from "$app/environment";
import * as LS from "$lib/stores/local-storage.js";

const prefersDark = function () {
  return window.matchMedia( "(prefers-color-scheme: dark)" ).matches === true;
}

const createTheme = function () {
  let theme;

  if ( browser ) {
    theme = LS.read( "gobo-theme" );

    if ( theme == null ) {
      if ( prefersDark() === true ) {
        theme = { dark: true };
      } else {
        theme = { dark: false };
      }
    
      LS.write( "gobo-theme", theme );
    }
  } else {
    theme = { dark: true };
  }
  
  const { subscribe, update } = writable( theme );

  return {
    subscribe,
    toggleDark: function () {
      update( function (theme) {
        theme.dark = !theme.dark;
        LS.write( "gobo-theme", theme );
        return theme;
      });
    },
    setDark: function () {
      update( function ( theme ) {
        theme.dark = true;
        LS.write( "gobo-theme", theme );
        return theme;
      });
    },
    setLight: function () {
      update( function ( theme ) {
        theme.dark = false;
        LS.write( "gobo-theme", theme );
        return theme; 
      });
    }
  };
};


export const theme = createTheme();
