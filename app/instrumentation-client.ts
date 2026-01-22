import { initBotId } from 'botid/client/core';
 
// Define the paths that need bot protection.
// These protect registration, pitch submission, and newsletter forms from bots.
// Only initialize in production to avoid dev server recompilation loops

if (process.env.NODE_ENV === 'production') {
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
}