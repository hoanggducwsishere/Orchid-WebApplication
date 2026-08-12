// Single source of truth for where the backend lives.
//
// Vite substitutes import.meta.env.* at BUILD time, not at runtime. That means
// VITE_API_BASE_URL must exist on the hosting platform *before* the build runs:
// adding it afterwards changes nothing until the site is redeployed.
const configured = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Only meant for `npm run dev` on a machine that also runs the Spring Boot app.
const LOCAL_FALLBACK = 'http://localhost:8080/api';

export const API_BASE_URL = (configured || LOCAL_FALLBACK).replace(/\/$/, '');

// A production build that fell back to LOCAL_FALLBACK can never work for real
// visitors: their browser would call their own machine, and a page served over
// HTTPS blocks plain HTTP requests as mixed content. Detect it instead of failing
// with a confusing "wrong password" message on the login screen.
//
// The test is "was the variable supplied", not "does the URL say localhost":
// building a production bundle that deliberately points at a local backend is a
// normal way to preview the real build, and it must not raise a false alarm.
export const isApiMisconfigured = import.meta.env.PROD && !configured;

if (isApiMisconfigured) {
  console.error(
    `[config] VITE_API_BASE_URL was not set when this build was made, so the app ` +
    `is calling ${API_BASE_URL} and every request will fail. Set it in your ` +
    `hosting platform's environment variables, then redeploy.`
  );
}

// Turns an axios failure into something truthful. Reporting a network or CORS
// error as "Invalid email or password" sends people hunting for the wrong bug.
export const getRequestErrorMessage = (err, credentialsMessage) => {
  const status = err?.response?.status;

  if (status === 400 || status === 401) {
    return err.response?.data?.message || credentialsMessage;
  }
  if (status) {
    return `Server error (${status}). Please try again later.`;
  }
  if (isApiMisconfigured) {
    return 'The app is not configured with a backend address. Please contact the site owner.';
  }
  return 'Cannot reach the server. It may be starting up — please try again in a minute.';
};
