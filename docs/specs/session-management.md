# Session Management

Last Updated: 2026-10-24

## Architecture

- **API operations** (GraphQL, consumed by the web app):
  - `mySessions(status: ACTIVE)`: lists the signed-in user's active sessions.
  - `revokeSession(sessionId)`: revokes one session.
  - `logoutAllSessions(includeSelf: false)`: revokes every session except the current one.
  - `logout`: revokes the current session server-side.
- **Client files**:
  - `graphql/type-query/session.ts` and `graphql/session.ts`: query and mutation documents.
  - `pages/web/_components/ActiveSessions.tsx`: the session list UI and its actions.
  - `pages/web/Settings.tsx`: renders `<ActiveSessions/>` inside the "Security & Privacy" card.
  - `components/Sidebar.tsx`: the Log Out action.

## Core Flows

1. **Viewing sessions.** Settings mounts `ActiveSessions`, which calls `mySessions(status: ACTIVE)`. While loading, a skeleton is shown. The current device is sorted first and labelled "This device". The current device row has no revoke button.
2. **Revoking another device.** The user clicks revoke on a row and confirms inline (two-step). The row is removed optimistically and `revokeSession(sessionId)` is sent. On failure the row is restored and an error toast is shown.
3. **Signing out other devices.** The user clicks "Sign out other devices" and confirms inline (two-step). The client calls `logoutAllSessions(includeSelf: false)`, then refreshes the list. The current session stays active.
4. **Logging out from the sidebar.** Log Out first calls the `logout` mutation as best effort. Errors from that call are ignored. The local token is then cleared, so the server-side session is revoked whenever the call succeeds.
5. **Refreshing.** A refresh button re-runs `mySessions` on demand.

## Edge Cases

- **List fetch fails:** an error state is shown with a Retry button.
- **No other sessions:** an empty state is shown. The current device is still listed.
- **Revoke fails:** the optimistic removal is rolled back and the row reappears with an error toast.
- **Current session in the list:** it can never be revoked from this list. Sign-out for the current device goes through the sidebar Log Out.
- **`logout` fails (network or server error):** the local token is still cleared, so the user is logged out locally. The server session stays active until it expires or is revoked elsewhere, because errors are ignored by design.
- **Concurrent revokes:** each row is handled independently. The list refreshes from the server after a mutation settles.

## Autonomous UX Polish

- Skeleton loader while `mySessions` is loading, to avoid layout shift.
- Error state with Retry, and an empty state with clear copy.
- Refresh button for the list.
- Optimistic per-row revoke with rollback on failure.
- Inline two-step confirm for both per-device revoke and "Sign out other devices".
- Success and error feedback via sonner toasts.
- `motion-reduce` variants on transitions.
- `aria-label`s on icon-only buttons and row actions.
