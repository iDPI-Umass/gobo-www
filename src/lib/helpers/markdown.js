import * as Type from "@dashkite/joy/type";
import Markdown from "markdown-it";
import mila from "markdown-it-link-attributes";
import Turndown from "turndown";

const platforms = {
  gobo: [
    "linkify",
    "html_block",
    "html_inline",
  ],
  bluesky: [
    "linkify",
  ],
  linkedin: [
    "linkify",
  ],
  mastodon: [
    "linkify",
  ],
  reddit: [
    "linkify",
    "heading",
    "list",
    "emphasis",
    "strikethrough",
    "blockquote",
    "code",
    "backticks",
    "fence",
    "table"
  ],
  smalltown: [
    "linkify",
  ],
}

const getConverter = ( platform ) => {
  let custom
  if ( platform ) {
    custom = platforms[ platform ]
    if (!custom) {
      custom = []
      console.warn(`no Markdown conversion configuration for platform ${platform}`)
    }
  }
  
  const md = new Markdown( "zero", {
    html:         true,        // Enable HTML tags in source
    xhtmlOut:     true,        // Use '/' to close single tags (<br />).
    breaks:       false,       // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-', // CSS language prefix for fenced blocks. Can be
                               // useful for external highlighters.
    linkify:      true,        // Autoconvert URL-like text to links
  
    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer:  false,
    
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: () => ""   
  });
  
  if ( custom.length > 0 ) {
    md.enable( custom )
  }

  md.set({linkify: true})
  md.linkify.add('mailto:', null) // disable matching on email links 

  md.use( mila, {
    attrs: {
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    },
  });

  // TODO: consider memoizing on content.
  const convert = ( content ) => {
    if ( Type.isString(content) && content.length > 0 ) {
      return md.render( content );
    }
  }

  return convert
};


// This overrides the internal escaping function and converts it into a no-op.
Turndown.prototype.escape = ( x ) => x

const parser = new Turndown({
  bulletListMarker: "-"
});

const toMarkdown = ( html ) => {
  return parser.turndown( html );
};

export {
  getConverter,
  toMarkdown
}