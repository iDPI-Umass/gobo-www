import * as Task from "./tasks/index.js";


const preview = function() {
  Task.Preview.run();
};

const deploy = async function () {
  const config = await Task.Environment.check();
  await Task.Bucket.deploy( config );
  await Task.Edge.deploy( config );
}

const teardown = async function () {
  const config = await Task.Environment.check();
  await Task.Edge.teardown( config );
  await Task.Bucket.teardown( config );
}

const publish = async function () {
  const config = await Task.Environment.check();
  const files = await Task.File.read( "build" );
  await Task.Bucket.check( config );
  await Task.Bucket.sync( config, files );

  // Only cache invalidate for environments that use caching.
  if ( config.edge.ttl.default > 0 ) {
    await Task.Edge.invalidate( config );
  }
};



const updateLogin = async function () {
  const config = await Task.Environment.check();
  await Task.Auth0.updateLogin( config );
}




const checkSecrets = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.check( config );
};

const putSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.put( config );
};

const putSecrets = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.putAll( config );
}

const getSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.get( config );
};

const removeSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.remove( config );
}






export {
  preview,

  deploy,
  teardown,
  publish,
  
  updateLogin,
  
  checkSecrets,
  putSecret,
  putSecrets,
  getSecret,
  removeSecret
}