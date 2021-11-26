import Cookies from 'universal-cookie';
import { fromUrl, parseDomain } from 'parse-domain';

const cookies = new Cookies();

export const getDomain = () => {
  const hostname = window.location.hostname;
  const domainInfo = parseDomain(hostname);
  return domainInfo.domain ? `${domainInfo.domain}.${domainInfo.topLevelDomains[0]}` : domainInfo.hostname;
}

export const setCookie = (field, params) => {
  cookies.set(field, params, { path: '/', domain: getDomain() });
}

export const getCookie = (field) => {
  return cookies.get(field);
}

export const removeCookie = (field) => {
  cookies.remove(field);
}
