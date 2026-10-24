# Memory Index

| Topic/Domain | 1-Line Core Rule / Decision | Detail File | Updated |
|---|---|---|---|
| Session logout | Sidebar Log Out calls the `logout` mutation (best effort) before clearing the local token, so the server session is revoked. | docs/memory/conventions.md#logout-revokes-the-server-session | 2026-10-24 |
| Session list UI | The current device is pinned first with "This device" and has no revoke button; revokes use inline two-step confirm. | docs/memory/conventions.md#session-list-current-device-pinned-two-step-revoke | 2026-10-24 |
