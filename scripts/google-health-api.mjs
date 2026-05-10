#!/usr/bin/env node
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const tokenPath = process.env.GOOGLE_HEALTH_TOKEN_FILE
  ? resolve(process.env.GOOGLE_HEALTH_TOKEN_FILE)
  : join(root, '.google-health-token.json');

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const API_BASE_URL = 'https://health.googleapis.com/v4';
const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly';
const EXPIRY_SKEW_MS = 60_000;

const command = process.argv[2] ?? 'help';
const args = parseArgs(process.argv.slice(3));

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  switch (command) {
    case 'auth-url':
      printAuthUrl();
      break;
    case 'token':
      await exchangeCode();
      break;
    case 'refresh':
      await refreshAccessToken();
      break;
    case 'list':
      await listDataPoints();
      break;
    case 'snapshot':
      await printSadhanaSnapshot();
      break;
    case 'help':
    default:
      printHelp();
      break;
  }
}

function printAuthUrl() {
  const clientId = requiredEnv('GOOGLE_HEALTH_CLIENT_ID');
  const redirectUri = env('GOOGLE_HEALTH_REDIRECT_URI', 'https://www.google.com');
  const scope = env('GOOGLE_HEALTH_SCOPE', DEFAULT_SCOPE);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: args.prompt ?? 'consent',
    scope,
  });
  console.log(`${AUTH_ENDPOINT}?${params.toString()}`);
}

async function exchangeCode() {
  const code = args.code === '-' ? await readStdin() : args.code ?? requiredEnv('GOOGLE_HEALTH_AUTH_CODE');
  const body = new URLSearchParams({
    code,
    client_id: requiredEnv('GOOGLE_HEALTH_CLIENT_ID'),
    client_secret: requiredEnv('GOOGLE_HEALTH_CLIENT_SECRET'),
    redirect_uri: env('GOOGLE_HEALTH_REDIRECT_URI', 'https://www.google.com'),
    grant_type: 'authorization_code',
  });
  const token = withTokenTimestamps(await postToken(body));
  persistToken(token);
  printJson(redactTokenForConsole(token));
}

async function refreshAccessToken() {
  const stored = readStoredToken();
  const refreshToken = args.refreshToken ?? process.env.GOOGLE_HEALTH_REFRESH_TOKEN ?? stored?.refresh_token;
  if (!refreshToken) {
    throw new Error('Missing refresh token. Set GOOGLE_HEALTH_REFRESH_TOKEN or run `npm run google-health -- token -- --code <code>` first.');
  }
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: requiredEnv('GOOGLE_HEALTH_CLIENT_ID'),
    client_secret: requiredEnv('GOOGLE_HEALTH_CLIENT_SECRET'),
    grant_type: 'refresh_token',
  });
  const token = withTokenTimestamps(await postToken(body));
  const merged = { ...stored, ...token, refresh_token: token.refresh_token ?? refreshToken };
  persistToken(merged);
  printJson(redactTokenForConsole(merged));
}

async function listDataPoints() {
  const dataType = args.dataType ?? 'exercise';
  const token = await getAccessToken();
  const endpoint = dataPointsUrl(dataType);
  const response = await fetchGoogleHealth(endpoint, token);
  await assertOk(response, `Google Health API list ${dataType}`);
  printJson(await response.json());
}

async function printSadhanaSnapshot() {
  const dataType = args.dataType ?? 'exercise';
  const token = await getAccessToken();
  const endpoint = dataPointsUrl(dataType);
  const response = await fetchGoogleHealth(endpoint, token);
  await assertOk(response, `Google Health API snapshot ${dataType}`);
  const payload = await response.json();
  const points = Array.isArray(payload.dataPoints) ? payload.dataPoints : [];
  const exerciseMinutes = points.reduce((sum, point) => sum + activeDurationMinutes(point), 0);
  const steps = points.reduce((sum, point) => sum + Number(point?.exercise?.metricsSummary?.steps ?? 0), 0);
  printJson({
    capturedAt: new Date().toISOString(),
    source: 'google-health-api',
    sourceDataType: dataType,
    exerciseMinutes: exerciseMinutes > 0 ? exerciseMinutes : null,
    steps: steps > 0 ? steps : null,
    sadhanaSensorSnapshot: {
      capturedAt: new Date().toISOString(),
      sleepDurationMinutes: null,
      sleepQualityScore: null,
      hrvTrend: null,
      recoveryScore: null,
      movementOvernight: null,
    },
    note: 'The codelab endpoint returns Fitbit/Google Health exercise data. Sadhana does not map this to sleep/HRV/recovery until matching Google Health data types are approved and verified.',
  });
}

async function getAccessToken() {
  const stored = readStoredToken();
  const accessToken = args.accessToken ?? process.env.GOOGLE_HEALTH_ACCESS_TOKEN ?? stored?.access_token;
  if (accessToken && !isTokenExpired(stored)) return accessToken;
  await refreshAccessToken();
  const refreshed = readStoredToken()?.access_token;
  if (!refreshed) throw new Error('Unable to resolve a Google Health access token after refresh.');
  return refreshed;
}

async function fetchGoogleHealth(endpoint, token) {
  let response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (response.status !== 401) return response;

  const stored = readStoredToken();
  if (!stored?.refresh_token || args.accessToken || process.env.GOOGLE_HEALTH_ACCESS_TOKEN) {
    return response;
  }

  await refreshAccessToken();
  const refreshed = readStoredToken()?.access_token;
  if (!refreshed) return response;
  response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${refreshed}`,
      Accept: 'application/json',
    },
  });
  return response;
}

async function postToken(body) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  await assertOk(response, 'Google OAuth token request');
  return response.json();
}

async function assertOk(response, label) {
  if (response.ok) return;
  const text = await response.text();
  throw new Error(`${label} failed with ${response.status}: ${text}`);
}

function activeDurationMinutes(point) {
  const duration = point?.exercise?.activeDuration;
  if (typeof duration !== 'string') return 0;
  const seconds = Number(duration.replace(/s$/, ''));
  return Number.isFinite(seconds) ? Math.round(seconds / 60) : 0;
}

function dataPointsUrl(dataType) {
  const url = new URL(`${API_BASE_URL}/users/me/dataTypes/${encodeURIComponent(dataType)}/dataPoints`);
  if (args.filter) url.searchParams.set('filter', args.filter);
  if (args.pageToken) url.searchParams.set('pageToken', args.pageToken);
  if (args.pageSize) url.searchParams.set('pageSize', args.pageSize);
  return url;
}

function withTokenTimestamps(token) {
  const issuedAt = Date.now();
  return {
    ...token,
    issued_at: issuedAt,
    expires_at:
      typeof token.expires_in === 'number' ? issuedAt + token.expires_in * 1000 : token.expires_at ?? null,
  };
}

function isTokenExpired(token) {
  if (!token?.expires_at) return false;
  return Date.now() + EXPIRY_SKEW_MS >= Number(token.expires_at);
}

function persistToken(token) {
  writeFileSync(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { mode: 0o600 });
  chmodSync(tokenPath, 0o600);
}

function readStoredToken() {
  if (!existsSync(tokenPath)) return null;
  return JSON.parse(readFileSync(tokenPath, 'utf8'));
}

function redactTokenForConsole(token) {
  return Object.fromEntries(
    Object.entries(token).map(([key, value]) => {
      if (key.includes('token') && typeof value === 'string') return [key, `${value.slice(0, 8)}...redacted`];
      return [key, value];
    })
  );
}

function env(name, fallback) {
  return process.env[name] || fallback;
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      value += chunk;
    });
    process.stdin.on('end', () => resolve(value.trim()));
    process.stdin.on('error', reject);
  });
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function printHelp() {
  console.log(`Sadhana Google Health API CLI

Commands:
  npm run google-health -- auth-url
  npm run google-health -- token -- --code <authorization-code>
  printf "%s" "$GOOGLE_HEALTH_AUTH_CODE" | npm run google-health -- token -- --code -
  npm run google-health -- refresh
  npm run google-health -- list -- --dataType exercise --pageSize 20
  npm run google-health -- snapshot -- --dataType exercise

Environment:
  GOOGLE_HEALTH_CLIENT_ID       OAuth web client ID from Google Cloud
  GOOGLE_HEALTH_CLIENT_SECRET   OAuth web client secret from Google Cloud
  GOOGLE_HEALTH_REDIRECT_URI    Defaults to https://www.google.com for the codelab
  GOOGLE_HEALTH_SCOPE           Defaults to ${DEFAULT_SCOPE}
  GOOGLE_HEALTH_ACCESS_TOKEN    Optional access token override
  GOOGLE_HEALTH_REFRESH_TOKEN   Optional refresh token override
  GOOGLE_HEALTH_TOKEN_FILE      Defaults to .google-health-token.json
`);
}
