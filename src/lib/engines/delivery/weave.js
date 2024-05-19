import * as Value from "@dashkite/joy/value";
import { Identity } from "$lib/engines/identity.js";

const Weave = {};

Weave.make = async ( graph ) => {
  const feed = [ ...graph.feed ];
  const deliveries = {};
  const proofs = {};
  const drafts = {};
  const files = {};
  const targets = {};
  for ( const delivery of graph.deliveries ) {
    deliveries[ delivery.id ] = delivery;
  }
  for ( const proof of graph.proofs ) {
    proofs[ proof.id ] = proof;
  }
  for ( const draft of graph.drafts ) {
    drafts[ draft.id ] = draft;
  }
  for ( const file of graph.files ) {
    files[ file.id ] = file;
  }
  for ( const target of graph.targets ) {
    targets[ target.id ] = target
  }

  for ( const delivery of graph.deliveries ) {
    delivery.proof = proofs[ delivery.proof_id ]
    delivery.draft = drafts[ delivery.draft_id ];
    const _files = [];
    for ( const id of delivery.proof.files ) {
      const file = files[ id ];
      if ( file != null ) {
        _files.push( file );
      }
    }
    delivery.files = _files;
    delivery.proof.files = _files;

    const _targets = [];
    for ( const id of delivery.targets ) {
      const target = targets[ id ];
      const identity = await Identity.find( target.identity_id );
      if ( identity == null ) {
        continue;
      }
      target.identity = Value.clone( identity );
      _targets.push( target );
    }
    delivery.targets = _targets;
  }

  return {
    feed: feed,
    deliveries
  };
};

export {
  Weave
}