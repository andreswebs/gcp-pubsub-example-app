import { listenForMessages } from './utils';
import { subscriptionNameOrId } from './constants';

console.log(`listening for events on ${subscriptionNameOrId}`);
listenForMessages();
