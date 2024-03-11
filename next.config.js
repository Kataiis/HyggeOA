/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['profile.line-scdn.net'],
    },
    env: {
        pathUrl: `https://hyggemedicalservice.com/phpapi/api`,
        HyggeOAliff: '2003391401-jDvm8MlZ', 
        APIKey: 'https://apimobile.hyggecode.com',
        // test //
        // HyggeOAliff: '2002893867-MzGeD6nL',
  
    }

};

module.exports = nextConfig