import { NextRequest, NextResponse } from 'next/server'

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) return null
  return res.json()
}

export async function GET(req: NextRequest) {
  let accessToken = req.cookies.get('spotify_access_token')?.value
  const refreshToken = req.cookies.get('spotify_refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ connected: false })
  }

  let newAccessToken: string | null = null

  if (!accessToken) {
    const refreshed = await refreshAccessToken(refreshToken)
    if (!refreshed) return NextResponse.json({ connected: false })
    accessToken = refreshed.access_token
    newAccessToken = refreshed.access_token
  }

  const playingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const response = NextResponse

  if (playingRes.status === 204 || playingRes.status === 404) {
    const res = NextResponse.json({ connected: true, playing: false })
    if (newAccessToken) res.cookies.set('spotify_access_token', newAccessToken, { httpOnly: true, maxAge: 3600, path: '/' })
    return res
  }

  if (playingRes.status === 401) {
    const refreshed = await refreshAccessToken(refreshToken)
    if (!refreshed) return NextResponse.json({ connected: false })
    accessToken = refreshed.access_token
    newAccessToken = refreshed.access_token

    const retry = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!retry.ok || retry.status === 204) {
      const res = NextResponse.json({ connected: true, playing: false })
      res.cookies.set('spotify_access_token', newAccessToken, { httpOnly: true, maxAge: 3600, path: '/' })
      return res
    }
  }

  if (!playingRes.ok) {
    return NextResponse.json({ connected: true, playing: false })
  }

  const playingData = await playingRes.json()

  if (!playingData?.item || playingData.item.type !== 'track') {
    const res = NextResponse.json({ connected: true, playing: false })
    if (newAccessToken) res.cookies.set('spotify_access_token', newAccessToken, { httpOnly: true, maxAge: 3600, path: '/' })
    return res
  }

  const track = playingData.item
  const trackId = track.id

  const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  let features = null
  if (featuresRes.ok) {
    features = await featuresRes.json()
  }

  const result = {
    connected: true,
    playing: true,
    track: {
      name: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(', '),
      album: track.album?.name ?? '',
      albumArt: track.album?.images?.[1]?.url ?? track.album?.images?.[0]?.url ?? null,
    },
    features: features ? {
      energy: features.energy,       // 0–1 — drives speed + brightness
      valence: features.valence,     // 0–1 — drives color warmth
      tempo: features.tempo,         // BPM — drives pulse rate
      danceability: features.danceability, // 0–1 — drives particle count
    } : null,
  }

  const res = NextResponse.json(result)
  if (newAccessToken) res.cookies.set('spotify_access_token', newAccessToken, { httpOnly: true, maxAge: 3600, path: '/' })
  return res
}
