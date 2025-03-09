// Kafka Topics (Static)
export const KAFKA_TOPICS: Record<string, string> = {
  postComment: 'vdp.v1.postcomment',
  postLike: 'vdp.v1.postlike',
  userFollowing: 'vdp.v1.userfollowing',
};

// Kafka Consumer Group (Static)
export const KAFKA_CONSUMER_GROUP: Record<string, string> = {
  sleeves: 'vault-sleeves-group',
};
