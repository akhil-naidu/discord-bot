import type { CollectionConfig } from 'payload'

export const ForumReplies: CollectionConfig = {
  slug: 'forum-replies',
  fields: [
    {
      name: 'threadId',
      type: 'relationship',
      relationTo: 'forum-threads',
      required: true,
      hasMany: false,
      unique: false,
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
      name: 'createdAt',
      type: 'date',
    },
  ],
}
