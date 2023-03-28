# gobo-www
Web Client Frontend for the GOBO Project


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build --production
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


## Deploying Infrastructure

> NOTE: you only need to do this once per environment or if infrastructure itself changes.

### Wesite S3 + CloudFront Distribution
```bash
AWS_PROFILE=idpi npx gulp deploy --environment=production-www
```

### CloudFront Distribution for GOBO API
```bash
AWS_PROFILE=idpi npx gulp deploy --environment=production-api
```


## Publish Code Changes
```bash
AWS_PROFILE=idpi npx gulp publish --environment=production-api
```
