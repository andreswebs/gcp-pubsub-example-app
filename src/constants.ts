const signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15,
};

const subscriptionNameOrId = process.env.SUBSCRIPTION || 'api-events';

const pollNotificationPeriodSeconds = process.env
  .POLL_NOTIFICATION_PERIOD_SECONDS
  ? parseInt(process.env.POLL_NOTIFICATION_PERIOD_SECONDS, 10)
  : 60;

const pollTimeoutSeconds = process.env.POLL_TIMEOUT_SECONDS
  ? parseInt(process.env.POLL_TIMEOUT_SECONDS, 10)
  : 3000;

export {
  signals,
  subscriptionNameOrId,
  pollNotificationPeriodSeconds,
  pollTimeoutSeconds,
};
