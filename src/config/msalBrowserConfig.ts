import { PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';

function isIEOrEdge() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  const trident = ua.indexOf('Trident/');
  const edge = ua.indexOf('Edge/');
  return msie > 0 || trident > 0 || edge > 0;
}

export const msalConfig: any = {
  auth: {
    clientId: environment.azureClientID,
    redirectUri: environment.redirectURI,
    authority: `https://login.microsoft.com/${environment.azureTenantID}`,
    navigateToLoginRequestUrl: false,
    scopes: [
      'openid',
      'profile',
      'email',
      'user.read',
      'api://lingolink-api/general',
    ],
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIEOrEdge(),
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
