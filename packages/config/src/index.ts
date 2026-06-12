export const appConfig = {
  appName: 'AMDOX ERP',
  version: '1.0.0',
  apiPrefix: '/api/v1',
};

export const authConfig = {
  accessTokenExpiry: '7d',
  refreshTokenExpiry: '30d',
  bcryptRounds: 10,
};

export const paginationConfig = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
};
