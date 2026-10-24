# Conventions

## Logout revokes the server session

Sidebar Log Out calls the `logout` mutation first (best effort, errors ignored), then clears the local token. This replaces the earlier rule that logout only cleared the local token. Rationale was not recorded in the handoff. Consequence: if the call fails, the server session stays active until it expires or is revoked. Detail: docs/specs/session-management.md.

## Session list: current device pinned, two-step revoke

The Settings active-sessions list sorts the current device first with a "This device" badge and never shows a revoke button on it. Revoke actions (per device and "Sign out other devices") use an inline two-step confirm, and per-row revoke is optimistic with rollback. Detail: docs/specs/session-management.md.
