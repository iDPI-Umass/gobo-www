import { Mastodon } from "$lib/engines/mention/platforms/mastodon.js"

const Smalltown = {};

Smalltown.mentionFromName = Mastodon.mentionFromName;

Smalltown.isHandle = Mastodon.isHandle;

Smalltown.resolveType = Mastodon.resolveType;

export {
  Smalltown
}