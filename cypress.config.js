import { defineConfig } from 'cypress';

export default defineConfig({
    video: false,

    e2e: {
        baseUrl: 'http://localhost:1337/',
        requestBaseUrl: 'http://api.localhost:1337',
    },
});
