import { NextRequest, NextResponse } from 'next/server'
import { Client, GatewayIntentBits, Events } from 'discord.js'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Ensure Node.js runtime for Discord API compatibility
export const runtime = 'nodejs'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Access to guild information
    GatewayIntentBits.GuildMessages, // Access to messages
    GatewayIntentBits.MessageContent, // Access to message content
    GatewayIntentBits.GuildMembers, // Access to member info (author of the post)
    GatewayIntentBits.GuildMessageReactions, // If you want to track reactions later
  ],
})

let botStarted = false

// Helper: Log post data
async function saveToPayload(label: 'thread' | 'reply', data: Record<string, any>) {
  console.log(`📢 [${label}]`, JSON.stringify(data, null, 2))

  const payload = await getPayload({
    config: configPromise,
  })

  if (label === 'thread') {
    await payload.create({
      collection: 'forum-threads',
      data: {
        id: data.postId,
        title: data.title,
        content: data.content,
        channelId: data.channelId,
        createdBy: data.createdBy,
        guildId: data.guildId,
        createdAt: data.createdAt,
      },
    })
  } else if (label === 'reply') {
    await payload.create({
      collection: 'forum-replies',
      data: {
        threadId: data.threadId,
        content: data.content,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
      },
    })
  }
}

// Track Discord forum posts and replies
async function startBot() {
  if (botStarted) return
  botStarted = true

  client.once(Events.ClientReady, () => {
    console.log(`✅ Bot is online as ${client.user?.tag}`)
  })

  // Capture new forum posts
  client.on(Events.ThreadCreate, async (thread) => {
    try {
      if (thread.parent?.type === 15) {
        // Ensure it's a forum post
        const firstMessage = await thread.messages.fetch({ limit: 1 })
        const postDetails = {
          content: firstMessage.first()?.content || 'No content',
          username: firstMessage.first()?.author?.username || thread.ownerId,
        }

        const forumPostData = {
          postId: thread.id,
          title: thread.name,
          content: postDetails.content,
          createdBy: postDetails.username,
          channelId: thread.parentId,
          guildId: thread.guildId,
          createdAt: thread.createdAt?.toISOString(),
        }

        await saveToPayload('thread', forumPostData)
      }
    } catch (error) {
      console.error('❌ Error capturing forum post:', error)
    }
  })

  // Capture replies to forum posts
  client.on(Events.MessageCreate, async (message) => {
    try {
      console.log(message.author.avatarURL())

      // Ensure it's inside a forum thread
      if (message.channel.isThread() && message.channel.parent?.type === 15) {
        const replyData = {
          threadId: message.channel.id,
          content: message.content,
          createdBy: message.author.username,
          createdAt: message.createdAt.toISOString(),
        }

        await saveToPayload('reply', replyData)
      }
    } catch (error) {
      console.error('❌ Error capturing reply:', error)
    }
  })

  try {
    await client.login(process.env.DISCORD_BOT_TOKEN)
  } catch (error) {
    console.error('❌ Discord login failed:', error)
  }
}

export async function GET(req: NextRequest) {
  await startBot()
  return NextResponse.json({ message: 'Discord bot is tracking forum posts and replies!' })
}
