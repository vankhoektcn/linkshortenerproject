---
description: "Use when changing Clerk authentication, sign-in or sign-up UI, sessions, protected routes, dashboard access, or auth redirects in this app."
---
# Clerk Authentication

- Use Clerk as the only authentication and identity provider. Do not add a separate auth library, custom password or session flow, or alternate source of user identity. Configure any social sign-in through Clerk.
- Protect `/dashboard` with Clerk server-side checks. Enforce authentication at the page or layout and again in each Server Action, Route Handler, or data-access boundary that exposes or changes protected data; do not rely only on `proxy.ts` or client-side UI.
- When a signed-in user requests `/`, redirect them to `/dashboard`. Keep the homepage available to signed-out visitors.
- Every sign-in and sign-up entry point, including direct visits to `/sign-in` and `/sign-up`, must open Clerk's modal flow. Use supported Clerk modal APIs such as `SignInButton` and `SignUpButton` with `mode="modal"`; do not render standalone full-page auth forms.
- Use the installed Clerk server and client APIs in their correct contexts, and keep `proxy.ts` focused on Clerk request handling rather than treating it as the sole authorization boundary.