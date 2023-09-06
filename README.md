# gobo-www
Web Client Frontend for the Gobo Project


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To build assets of the application to publish, use:

```bash
npx gulp build
```

## Publish Code Changes
```bash
AWS_PROFILE=idpi npx gulp publish --environment=production-www
```


## Deploying Infrastructure

> NOTE: you only need to do this once per environment or if infrastructure itself changes.

### Wesite S3 + CloudFront Distribution
```bash
AWS_PROFILE=idpi npx gulp deploy --environment=production-www
```

### CloudFront Distribution for Gobo API
```bash
AWS_PROFILE=idpi npx gulp deploy --environment=production-api
```



