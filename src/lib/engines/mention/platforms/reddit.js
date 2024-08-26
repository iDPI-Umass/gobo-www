
/**
 * I had some trouble locating a definitive source within Reddit's API docs
 * or even the PRAW codebase. But it appears Reddit has a longstanding
 * username ruleset that I see referenced repeatedly over the years.
 * 
 * - https://stackoverflow.com/questions/46104630/regex-to-identify-reddit-usernames
 * - https://www.reddit.com/r/counting/comments/j3vdtq/reddit_usernames_u/
 * - https://www.reddit.com/r/help/comments/zvvgeb/which_syntax_for_username/
 * - https://www.reddit.com/r/NoStupidQuestions/comments/14pl5ah/will_reddit_even_run_out_of_usernames/
 */

const Reddit = {};

Reddit.mentionFromName = ( name = "" ) => {
  if ( name.startsWith('@') ) {
    return 'u/' + name.slice(1);
  } else {
    return 'u/' + name;
  }
};

Reddit.isHandle = ( string = "" ) => {
  return /^u\/[a-z0-9_-]{3,20}$/i.test(string)
};

Reddit.resolveType = ( string ) => {
  if ( Reddit.isHandle(string) ) {
    return "handle";
  } else {
    return "placeholder";
  }
}

Reddit.getSuggestions = async ( identity, query ) => {
  return [];
};

export {
  Reddit
}