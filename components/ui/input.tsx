"use client"

import React, { useState } from 'react'
import QRCode from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [level, setLevel] = useState('L')
  const [centerImage, setCenterImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState(60)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCenterImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = url
      link.click()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>QR Code Generator<
