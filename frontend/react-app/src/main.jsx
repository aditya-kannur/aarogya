import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-0pgthid6nhe6r5x6.us.auth0.com"
    clientId="g3EJZsncnkpTui74vOKPErLHZzZMVmTu"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>,
);