export function load({ url }) {
  const search = url.searchParams.get( "search" );
  return { search };
};