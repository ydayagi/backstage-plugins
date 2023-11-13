# Notifications Frontend

This Backstage front-end plugin provides:

- NotificationsApi for accessing notifications by other FE plugins
- common visual components like the Notifications Page, active left-side Notifications menu item or system-wide notifications alerts

It depends on the notifications-common package and makes REST API calls to the backend implemented within notifications-backend plugin.

## Getting started

- Have the notifications-backend running (follow README instructions there)

## Installing the plugin

TODO

## Using the Notifications API

```
import { notificationsApiRef } from '@backstage/plugin-notifications-frontend';
...
const notificationsApi = useApi(notificationsApiRef);
```

Check the `src/api/notificationsApi.ts` for the API description.

## Front-end React Compoenents

### NotificationsPage

A page for listing and managing notifications from the logged-in users perspective.

### NotificationsSidebarItem

Represents a left-side menu item for the Notifications.

Contains polling of the `/notifications/count` endpoint to mark if there is a new user's notification available.

Contains polling of the `/notifications` endpoint to potentially show an alert for new system-wide notification.

### Utils

- `usePollingEfect()` - React hook to ease polling
