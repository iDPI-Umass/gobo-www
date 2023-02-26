import * as Task from "./tasks/index.js";


const preview = function() {
  Task.preview();
};

const deploy = async function () {
  const config = await Task.checkEnvironment();
  await Task.deployBuckets( config );
  await Task.deployEdge( config );
}

const teardown = async function () {
  const config = await Task.checkEnvironment();
  await Task.teardownEdge( config );
  await Task.teardownBuckets( config );
}

const publish = async function () {
  const config = await Task.checkEnvironment();
  const files = await Task.getLocalFiles();
  await Task.checkBuckets( config );
  await Task.syncBucket( config, files );
  // await Task.invalidateCache( config );
};

export {
  preview,
  deploy,
  teardown,
  publish
}