'use client'
import { useEffect } from 'react'

export default function SignUpPage() {
  useEffect(() => {
    window.location.href = 'https://accounts.studybuddyai.academy/sign-up'
  }, [])
  return <div style={{background:'#06060f',minHeight:'100vh'}}/>
}