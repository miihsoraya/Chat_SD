import io from 'socket.io-client';

const STRAPI_ENDPOINT = 'https://git.heroku.com/paloochat-frontend.git';
export const socket = io(STRAPI_ENDPOINT);
