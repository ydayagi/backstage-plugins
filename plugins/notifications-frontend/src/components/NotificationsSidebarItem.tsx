import React from 'react';

import { SidebarItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import { Tooltip } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';

import { notificationsApiRef } from '../api';
import { NOTIFICATIONS_ROUTE } from '../constants';
import { usePollingEffect } from './usePollingEffect';

const NotificationsErrorIcon = () => (
  <Tooltip title="Failed to load notifications">
    <NotificationsOffIcon />
  </Tooltip>
);

export const NotificationsSidebarItem = () => {
  const notificationsApi = useApi(notificationsApiRef);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const pollCallback = React.useCallback(async () => {
    try {
      setUnreadCount(await notificationsApi.getUnreadCount(/* params */));
    } catch (e: unknown) {
      setError(e as Error);
    }
  }, [notificationsApi]);

  usePollingEffect(pollCallback, [
    /* params */
  ]);

  let icon = NotificationsIcon;
  if (!!error) {
    icon = NotificationsErrorIcon;
  }

  return (
    <SidebarItem
      icon={icon}
      to={NOTIFICATIONS_ROUTE}
      text="Notifications"
      hasNotifications={!error && !!unreadCount}
    />
  );
};
