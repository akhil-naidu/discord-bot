import type { CollectionConfig } from 'payload'

export const ForumPosts: CollectionConfig = {
  slug: 'forum-posts',
  fields: [
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
      name: 'postId',
      type: 'text',
      unique: true,
    },
    {
      name: 'createdAt',
      type: 'date',
    },
  ],
}
