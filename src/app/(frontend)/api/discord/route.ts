import { NextRequest, NextResponse } from 'next/server'
import { Client, GatewayIntentBits, Events } from 'discord.js'

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
function logPostData(label: string, data: Record<string, any>) {
  console.log(`📢 [${label}]`, JSON.stringify(data, null, 2))
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
        const postContent = firstMessage.first()?.content || 'No content'

        const forumPostData = {
          postId: thread.id,
          title: thread.name,
          content: postContent,
          createdBy: thread.ownerId,
          channelId: thread.parentId,
          guildId: thread.guildId,
          createdAt: thread.createdAt?.toISOString(),
        }

        logPostData('New Forum Post', forumPostData)
      }
    } catch (error) {
      console.error('❌ Error capturing forum post:', error)
    }
  })

  // Capture replies to forum posts
  client.on(Events.MessageCreate, async (message) => {
    try {
      // Ensure it's inside a forum thread
      if (message.channel.isThread() && message.channel.parent?.type === 15) {
        const replyData = {
          threadId: message.channel.id,
          content: message.content,
          authorId: message.author.id,
          authorUsername: message.author.username,
          createdAt: message.createdAt.toISOString(),
        }

        logPostData('New Reply', replyData)
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
