'use client'
import { useEffect } from 'react'

export default function SignInPage() {
  useEffect(() => {
    window.location.href = 'https://accounts.studybuddyai.academy/sign-in'
  }, [])
  return <div style={{background:'#06060f',minHeight:'100vh'}}/>
}