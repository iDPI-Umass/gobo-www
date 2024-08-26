/**
 * LinkedIn is a tough case. Their post creation HTTP API is coupled to how
 * they present client HX.
 * 
 * See this link for a description of that flow:
 * https://www.linkedin.com/help/linkedin/answer/a525082/mention-people-in-your-posts
 * 
 * The expectation is that client provides HX where a person
 * can select the target entity, to then map into a LinkedIn URN that is
 * associated with the post through property annotations that look like 
 * Bluesky facets.
 * 
 * See this link for a description of that flow:
 * https://learn.microsoft.com/en-us/linkedin/compliance/integrations/shares/ugc-post-api?tabs=http#mentions-in-ugc-posts
 * 
 * Because we cannot freely retrieve the URN for LinkedIn entities, we can't
 * actually do any of this for now. It will need to wait for our integration 
 * with their typeahead API. Always return false for isHandle.
 */

const Linkedin = {};

// We can't currently provide first-class LinkedIn mentions, so we want avoid 
// using the @ symbol until that changes.
Linkedin.mentionFromName = ( name = "" ) => {
  if ( name.startsWith('@') ) {
    return name.slice(1);
  } else {
    return name;
  }
};

Linkedin.isHandle = ( string = "" ) => {
  return false;
};

Linkedin.resolveType = ( string ) => {
  if ( Linkedin.isHandle(string) ) {
    return "handle";
  } else {
    return "placeholder";
  }
}

Linkedin.getSuggestions = async ( identity, query ) => {
  return [];
};

export {
  Linkedin
}
