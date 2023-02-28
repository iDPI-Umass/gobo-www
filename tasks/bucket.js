import * as S3 from "@dashkite/dolores/bucket";

const checkBucket = async function ( bucket ) {
  const exists = await S3.hasBucket( bucket.name );

  if ( exists !== true ) {
    throw new Error( `Bucket ${ bucket.name } is not configured.` );
  }
};

const checkBuckets = async function ( config ) {
  for ( const bucket of config.buckets ) {
    await checkBucket( bucket );
  }
};


const deployBucket = async function ( bucket ) {
  await S3.putBucket( bucket.name );

  // Place the bucket into website mode.
  await S3.putBucketPolicy( bucket.name, {
    Version: "2012-10-17",
    Statement: [{
      Sid: "Web Site Access",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${ bucket.name }/*`
    }]
  });

  if ( bucket.website != null ) {
    await S3.putBucketWebsite( bucket.name, bucket.website );
  } else if ( bucket.redirect != null ) {
    await S3.putBucketRedirect( bucket.name, bucket.redirect );
  }
};

const deployBuckets = async function ( config ) {
  for ( const bucket of config.buckets ) {
    await deployBucket( bucket );
  }
};


const teardownBucket = async function ( bucket ) {
  await S3.emptyBucket( bucket.name );
  await S3.deleteBucket( bucket.name );
};

const teardownBuckets = async function ( config ) {
  for ( const bucket of config.buckets ) {
    await teardownBucket( bucket );
  }
};

export {
  checkBuckets,
  deployBuckets,
  teardownBuckets
}