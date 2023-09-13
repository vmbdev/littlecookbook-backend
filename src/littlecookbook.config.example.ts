export const password = {
  minLength: 6,
  requireUppercase: true,
  requireNumber: true,
  requireNonAlphanumeric: true,
};

export const session = {
  secret: '12345',
  redisUrl: 'redis://localhost:6379',
};
