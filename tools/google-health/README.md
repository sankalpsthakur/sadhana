# Google Health API CLI

This folder connects Sadhana to the Google Health API codelab flow for developer QA.

It is not the same as Sadhana's on-device Health integrations:

- iOS app: Apple HealthKit via `src/health/provider.ios.ts`.
- Android app: Health Connect via `src/health/provider.android.ts`.
- Developer CLI: Google Health API OAuth/REST against `https://health.googleapis.com/v4`.

## Setup

Create a Google Cloud OAuth web client, enable Google Health API, add a test user, and add the codelab scope:

```sh
export GOOGLE_HEALTH_CLIENT_ID="..."
export GOOGLE_HEALTH_CLIENT_SECRET="..."
export GOOGLE_HEALTH_REDIRECT_URI="https://www.google.com"
```

Generate the consent URL:

```sh
npm run google-health -- auth-url
```

Open the URL, approve access with a configured test user, then copy the `code=` value from the redirect URL.

Exchange the code. To avoid putting the authorization code in shell history, prefer stdin:

```sh
npm run google-health -- token -- --code "4/..."
printf "%s" "$GOOGLE_HEALTH_AUTH_CODE" | npm run google-health -- token -- --code -
```

List exercise data:

```sh
npm run google-health -- list -- --dataType exercise
```

Print a Sadhana-shaped QA snapshot:

```sh
npm run google-health -- snapshot -- --dataType exercise
```

The CLI stores local tokens in `.google-health-token.json` by default. Keep that file uncommitted.

Do not paste real secrets or tokens into the tracked `.http` file. Use environment variables, a local password manager, or an untracked scratch file for real OAuth values. Do not run raw `list` output in CI or shared logs; Google Health responses can contain sensitive health data.

## Production boundary

Do not put `GOOGLE_HEALTH_CLIENT_SECRET` in the mobile app. Production Google Health API support should use a backend OAuth callback and encrypted token storage, or stay Android-local through Health Connect.

The codelab endpoint uses Fitbit/Google Health exercise data. Sadhana's current product logic personalizes from sleep duration, HRV, and resting heart rate, so exercise data is exposed for QA but not mapped into recovery scores.
