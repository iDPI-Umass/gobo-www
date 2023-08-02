import * as Type from "@dashkite/joy/type";
import Markdown from "markdown-it";
import mila from "markdown-it-link-attributes";

const md = new Markdown({
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     true,        // Use '/' to close single tags (<br />).
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      true,         // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (/*str, lang*/) { return ''; }
});

md.use( mila, {
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
});

// TODO: is it a meaningful improvement to has the content of the post and use
// that to build an in-memory cache of the resulting HTML?
const render = function ( content ) {
  if ( Type.isString(content) && content.length > 0 ) {
    return md.render( content );
  }
}

export {
  render
}