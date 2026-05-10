import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'SPOTIFY_CLIENT_ID not set in .env.local' }, { status: 500 })
  }

  const redirectUri = process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/spotify/callback`
    : 'http://localhost:3000/api/spotify/callback'

  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
  })

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
}
