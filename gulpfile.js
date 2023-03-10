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

  // Only cache invalidate for environments that use caching.
  if ( config.edge.ttl.default > 0 ) {
    await Task.invalidateCache( config );
  }
};

const scratch = async function () {
  const value = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImowTHVqVFlzaTJqNlotN3Uwa3Z1bCJ9.eyJuaWNrbmFtZSI6ImRhdmlkK3Rlc3QuMjAyMy4wMi4wOSIsIm5hbWUiOiJkYXZpZCt0ZXN0LjIwMjMuMDIuMDlAcGFuZGFzdHJpa2UuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2RkNzdiM2ExOWNlNDA3NzAzMzUzODMxOGM2MzgyZTZlP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGZGEucG5nIiwidXBkYXRlZF9hdCI6IjIwMjMtMDMtMDhUMDQ6MTI6MzkuNzUxWiIsImVtYWlsIjoiZGF2aWQrdGVzdC4yMDIzLjAyLjA5QHBhbmRhc3RyaWtlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmdvYm8uc29jaWFsLyIsImF1ZCI6InVyREpPQ1VpenpRbTRMWjdrdjVVUXNkSVlFbk9DdXdHIiwiaWF0IjoxNjc4MjQ4NzYxLCJleHAiOjE2NzgyODQ3NjEsInN1YiI6ImF1dGgwfDYzZTU3MmY2ODM1NDkwZjBhZWQ5ZGNlMCIsInNpZCI6Im00WVQ1dmxaVk9hUHFoNGdKaGR4MmIyYmlpMXc3REVqIiwibm9uY2UiOiJObEpwYjJWSVJ6TnlXbUpsVjI5QmRpMUNaMFZyT1RCTmNGWmthekJHYUd4UlJXSlhkVnBPU0RObFF3PT0ifQ.qVlz_LHt-MavwBhE5rr-IDX11CrGTd0qz1FQgMV6ncv4drKzxv_sZR-l0w5DlhcsD6dpN8G_xFkfQwrROIfEMVa5hn6HN7vvtdBAqe0sA5xJ_l5YnRpXgSqEB2ANgmnQwsMsO388ShkvSztLaHY_Hhh8nvdOPIci58GuydylhgWyiLD9ETokytENw4A5gRUUkBfk18g2HB9RsJZWgvF4-J4ovu7J6Tprj-2auxHK1qGu385mLuAZGkz3daWrgHpGfbCIE_r3_4eMf1SRWdaz7ehHYh5HSo7ZbwUCmGM6xQICREyf-wFjg9gVIWndf4X_ofJyS5jQxlIm1vB6-8ujkA";
  const target = value.split(".")[1];
  console.log(Buffer.from( target, "base64" ).toString("utf8"));
};

export {
  preview,
  deploy,
  teardown,
  publish,
  scratch
}