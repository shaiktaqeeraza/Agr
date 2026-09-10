import { Client, Databases, Storage, Query, ID } from "appwrite";
import conf, { isAppwriteConfigured } from "./conf";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    if (isAppwriteConfigured) {
      this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    }
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // ---------- POSTS ----------
  async createPost({ userId, userName, location, cropName, price, quantity, caption, imageId }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionPostsId,
      ID.unique(),
      {
        userId,
        userName,
        location,
        cropName,
        price,
        quantity,
        caption: caption || "",
        imageId,
        status: "available",
        createdAt: new Date().toISOString(),
      }
    );
  }

  async getPosts() {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionPostsId,
      [Query.orderDesc("createdAt")]
    );
  }

  async getUserPosts(userId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionPostsId,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
  }

  async markAsSold(postId) {
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionPostsId,
      postId,
      { status: "sold" }
    );
  }

  async deletePost(postId) {
    return await this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionPostsId,
      postId
    );
  }

  // ---------- IMAGES ----------
  async uploadImage(file) {
    return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
  }

  getImagePreview(imageId) {
    return this.bucket.getFileView(conf.appwriteBucketId, imageId);
  }

  async deleteImage(imageId) {
    return await this.bucket.deleteFile(conf.appwriteBucketId, imageId);
  }

  // ---------- LIKES ----------
  async toggleLike(postId, userId) {
    const existing = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionLikesId,
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );
    if (existing.documents.length > 0) {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionLikesId,
        existing.documents[0].$id
      );
      return false; // now unliked
    } else {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionLikesId,
        ID.unique(),
        { postId, userId }
      );
      return true; // now liked
    }
  }

  async getLikesForPost(postId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionLikesId,
      [Query.equal("postId", postId)]
    );
  }

  // ---------- COMMENTS ----------
  async addComment({ postId, userId, userName, text }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionCommentsId,
      ID.unique(),
      { postId, userId, userName, text, createdAt: new Date().toISOString() }
    );
  }

  async getComments(postId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionCommentsId,
      [Query.equal("postId", postId), Query.orderAsc("createdAt")]
    );
  }

  // ---------- FOLLOWS ----------
  async toggleFollow(followerId, followingId) {
    const existing = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionFollowsId,
      [Query.equal("followerId", followerId), Query.equal("followingId", followingId)]
    );
    if (existing.documents.length > 0) {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionFollowsId,
        existing.documents[0].$id
      );
      return false;
    } else {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionFollowsId,
        ID.unique(),
        { followerId, followingId }
      );
      return true;
    }
  }

  async getFollowing(followerId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionFollowsId,
      [Query.equal("followerId", followerId)]
    );
  }

  // ---------- SAVED ----------
  async toggleSave(userId, postId) {
    const existing = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionSavedId,
      [Query.equal("userId", userId), Query.equal("postId", postId)]
    );
    if (existing.documents.length > 0) {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSavedId,
        existing.documents[0].$id
      );
      return false;
    } else {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSavedId,
        ID.unique(),
        { userId, postId }
      );
      return true;
    }
  }

  async getSaved(userId) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionSavedId,
      [Query.equal("userId", userId)]
    );
  }

  // ---------- MESSAGES ----------
  async sendMessage({ senderId, receiverId, text }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionMessagesId,
      ID.unique(),
      { senderId, receiverId, text, createdAt: new Date().toISOString() }
    );
  }

  async getConversation(userA, userB) {
    const sent = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionMessagesId,
      [Query.equal("senderId", userA), Query.equal("receiverId", userB)]
    );
    const received = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionMessagesId,
      [Query.equal("senderId", userB), Query.equal("receiverId", userA)]
    );
    return [...sent.documents, ...received.documents].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }
}

const service = new Service();
export default service;
