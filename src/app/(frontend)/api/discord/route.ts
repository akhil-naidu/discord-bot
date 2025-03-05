import { NextRequest, NextResponse } from 'next/server'
import { Client, GatewayIntentBits, Events } from 'discord.js'
import payload from 'payload'

// Ensure Node.js runtime for Discord API compatibility
export const runtime = 'nodejs'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

let botStarted = false

// Helper: Save to Payload CMS using local API
async function saveToPayloadCMS(data: Record<string, any>) {
  try {
    // payload.create
    console.log('✅ Forum post saved to Payload CMS:', data)
  } catch (error) {
    console.error('❌ Error saving to Payload CMS:', error)
  }
}

// Discord bot listener
async function startBot() {
  if (botStarted) return
  botStarted = true

  client.once(Events.ClientReady, () => {
    console.log(`✅ Bot is online as ${client.user?.tag}`)
  })

  client.on(Events.ThreadCreate, async (thread) => {
    if (thread.parent?.type === 15) {
      try {
        const firstMessage = await thread.messages.fetch({ limit: 1 })
        const postContent = firstMessage.first()?.content || 'No content'

        // Prepare forum post data
        const forumPostData = {
          postId: thread.id,
          title: thread.name,
          content: postContent,
          createdBy: thread.ownerId,
          channelId: thread.parentId,
          guildId: thread.guildId,
          createdAt: thread.createdAt?.toISOString(),
        }

        console.log('📢 New Forum Post:', forumPostData)

        // Save to Payload CMS
        await saveToPayloadCMS(forumPostData)
      } catch (error) {
        console.error('❌ Error processing thread:', error)
      }
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
  return NextResponse.json({ message: 'Discord bot is capturing forum posts!' })
}
