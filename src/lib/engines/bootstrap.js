import * as Identity from "$lib/engines/identity.js";
import * as Filter from "$lib/engines/filter.js";
import * as Notification from "$lib/engines/notification.js";
import * as Posts from "$lib/engines/feed/index.js";
import * as Delivery from "$lib/engines/delivery/index.js";

// Even though they're not used in this specific file, importing the engines
// responsible for managing feed behavior need to be initialized reliablly.
// We do that here.

import { App } from "$lib/engines/account.js";

const Bootstrap = {};

Bootstrap.run = async () => {
  await App.startup();
};

export {
  Bootstrap
}