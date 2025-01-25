export const getRedisKey = {
  userSession: (userId: string) => `user:session:${userId}`,
  userProfile: (userId: string) => `user:profile:${userId}`,
};
