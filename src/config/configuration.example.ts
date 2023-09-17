export default () => ({
  password: {
    minLength: 6,
    requireUppercase: true,
    requireNumber: true,
    requireNonAlphanumeric: true,
  },
  session: {
    secret: '12345',
  },
  redisUrl: 'redis://localhost:6379',
});
