import { initBotId } from 'botid/client/core';
 
// Define the paths that need bot protection.
// These protect registration, pitch submission, and newsletter forms from bots.
 
initBotId({
  protect: [
    {
      path: '/api/register',
      method: 'POST',
    },
    {
      path: '/api/pitch',
      method: 'POST',
    },
    {
      path: '/api/newsletter',
      method: 'POST',
    },
  ],
});