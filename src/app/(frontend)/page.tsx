'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState('Starting bot...')

  useEffect(() => {
    const startBot = async () => {
      try {
        const response = await fetch('/api/discord')
        const data = await response.json()
        setStatus(data.message)
      } catch (error) {
        setStatus('Error starting bot.')
      }
    }
    startBot()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">🚀 Discord Bot in Next.js 15</h1>
      <p className="mt-4">{status}</p>
    </main>
  )
}
