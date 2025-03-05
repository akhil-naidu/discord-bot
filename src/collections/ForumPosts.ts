import type { CollectionConfig } from 'payload'

// 📢 [New Forum Post] {
//   "postId": "1346806413132828733",
//   "title": "Created a new thread",
//   "content": "Hello there, this is a new message for this thread",
//   "createdBy": "746413401718259772",
//   "channelId": "1346786399902498816",
//   "guildId": "1346774248206893116",
//   "createdAt": "2025-03-05T11:27:51.344Z"
// }

export const ForumThreads: CollectionConfig = {
  slug: 'forum-threads',
  fields: [
    {
      name: 'id',
      required: true,
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'createdBy',
      type: 'text',
    },
    {
      name: 'channelId',
      type: 'text',
    },
    {
      name: 'guildId',
      type: 'text',
    },
    {
      name: 'createdAt',
      type: 'date',
    },
    {
      name: 'replies',
      type: 'join',
      label: 'Replies',
      collection: 'forum-replies',
      on: 'threadId',
    },
  ],
}
