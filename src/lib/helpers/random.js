import { convert } from "@dashkite/bake";

const random = ( length, encoding ) => {
  const bytes = new Uint8Array( length );
  self.crypto.getRandomValues( bytes );
  return convert(
    { from: "bytes", to: encoding },
    bytes
  );
};

const address = () => random( 16, "base36" );

export {
  random,
  address
}