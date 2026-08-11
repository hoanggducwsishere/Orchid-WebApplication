// Google OAuth Web Client IDs are public by design (they are sent to Google in
// plain sight on every sign-in request), so keeping a fallback here is safe and
// lets production keep working even when VITE_GOOGLE_CLIENT_ID is not configured
// on the hosting platform.
const FALLBACK_CLIENT_ID =
  '658378569553-vhfuo85a3clthm6gk8ef4vga5qb5dgr2.apps.googleusercontent.com';

export const googleClientId =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID || FALLBACK_CLIENT_ID || '').trim();

// Never hand an empty client id to the Google Identity Services script: it throws
// "Missing required parameter client_id", and because that throw happens inside a
// React effect it tears down the whole app and leaves a blank page.
export const isGoogleAuthEnabled = googleClientId.length > 0;
