import { PubSub, Message } from '@google-cloud/pubsub';

import {
  signals,
  subscriptionNameOrId,
  pollNotificationPeriodSeconds,
  pollTimeoutSeconds,
} from './constants';

const pubSubClient = new PubSub();

const subscription = pubSubClient.subscription(subscriptionNameOrId);

let poll = true;

async function sleep(waitMilliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, waitMilliseconds));
}

function cleanExit() {
  console.log('shutdown');
  console.log('reached job timeout');
  process.exit(0);
}

function shutdown(signal: string, value: number) {
  console.log('shutdown');
  console.log(`stopped by ${signal}`);
  poll = false;
  process.exit(128 + value);
}

function startJobTimer() {
  setTimeout(() => {
    poll = false;
  }, pollTimeoutSeconds * 1000);
}

function configureSignals() {
  Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
      console.log(`\nreceived ${signal}`);
      shutdown(signal, signals[signal]);
    });
  });
}

async function listenForMessages() {
  configureSignals();

  let messageCount = 0;

  if (pollTimeoutSeconds > 0) {
    startJobTimer();
  }

  const messageHandler = (message: Message) => {
    messageCount += 1;
    console.log(`received message ${message.id}`);
    try {
      const data = message.data.toString();
      message.ack();
      if (data) {
        console.log(
          JSON.stringify(
            {
              msgId: message.id,
              attributes: message.attributes,
              data,
            },
            null,
            2
          )
        );
      } else {
        console.log('empty');
      }
    } catch (e) {
      console.error(e);
    }
  };

  subscription.on('message', messageHandler);

  while (poll) {
    await sleep(pollNotificationPeriodSeconds * 1000).then(() => {
      console.log(`${messageCount} message(s) received`);
      messageCount = 0;
    });
  }

  cleanExit();
}

export { listenForMessages };
