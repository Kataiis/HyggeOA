/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['profile.line-scdn.net'],
    },
    env: {
        pathUrl: `https://hyggemedicalservice.com/phpapi/api`,
        HyggeOAliff: '2003391401-jDvm8MlZ',
    }

};

module.exports = nextConfig