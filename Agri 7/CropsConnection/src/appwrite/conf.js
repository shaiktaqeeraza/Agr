const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  appwriteCollectionPostsId: import.meta.env.VITE_APPWRITE_COLLECTION_POSTS_ID,
  appwriteCollectionCommentsId: import.meta.env.VITE_APPWRITE_COLLECTION_COMMENTS_ID,
  appwriteCollectionLikesId: import.meta.env.VITE_APPWRITE_COLLECTION_LIKES_ID,
  appwriteCollectionFollowsId: import.meta.env.VITE_APPWRITE_COLLECTION_FOLLOWS_ID,
  appwriteCollectionSavedId: import.meta.env.VITE_APPWRITE_COLLECTION_SAVED_ID,
  appwriteCollectionMessagesId: import.meta.env.VITE_APPWRITE_COLLECTION_MESSAGES_ID,
  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

export const isAppwriteConfigured = Boolean(conf.appwriteUrl && conf.appwriteProjectId);

export default conf;
