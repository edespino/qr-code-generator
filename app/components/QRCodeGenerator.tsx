"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const QRCodeGenerator = () => {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [dotStyle, setDotStyle] = useState('square')
  const [eyeStyle, setEyeStyle] = useState('square')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [centerImage, setCenterImage] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(Math.floor(size * 0.2))
  const [logoMargin, setLogoMargin] = useState(5)
  
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCode = useRef<any>(null)

  useEffect(() => {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!qrCode.current) {
        qrCode.current = new QRCodeStyling({
          width: size,
          height: size,
          data: text,
          dotsOptions: {
            type: dotStyle,
            color: fgColor
          },
          cornersSquareOptions: {
            type: eyeStyle,
            color: fgColor
          },
          backgroundOptions: {
            color: bgColor
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: logoMargin,
            hideBackgroundDots: true
          }
        })

        if (qrRef.current) {
          qrRef.current.innerHTML = ''
          qrCode.current.append(qrRef.current)
        }
      }
    })

    return () => {
      qrCode.current = null
    }
  }, [])

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        width: size,
        height: size,
        data: text,
        dotsOptions: {
          type: dotStyle,
          color: fgColor
        },
        cornersSquareOptions: {
          type: eyeStyle,
          color: fgColor
        },
        backgroundOptions: {
          color: bgColor
        },
        image: centerImage || undefined,
        imageOptions: {
          imageSize: centerImage ? logoSize / size : 0,
          crossOrigin: 'anonymous',
          margin: logoMargin,
          hideBackgroundDots: true
        }
      })
    }
  }, [text, size, dotStyle, eyeStyle, fgColor, bgColor, centerImage, logoSize, logoMargin])

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
    if (qrCode.current) {
      qrCode.current.download({
        extension: 'png'
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div ref={qrRef} className="flex justify-center mb-6" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text"
            />
          </div>

          <div className="space-y-2">
            <Label>QR Code Size: {size}px</Label>
            <Slider
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
              min={128}
              max={512}
              step={8}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dot Style</Label>
              <Select value={dotStyle} onValueChange={setDotStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Eye Style</Label>
              <Select value={eyeStyle} onValueChange={setEyeStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Foreground Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-16 p-1 h-10"
                />
                <Input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 p-1 h-10"
                />
                <Input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Center Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
          </div>

          {centerImage && (
            <>
              <div className="space-y-2">
                <Label>Logo Size: {logoSize}px</Label>
                <Slider
                  value={[logoSize]}
                  onValueChange={(value) => setLogoSize(value[0])}
                  min={32}
                  max={Math.floor(size * 0.4)}
                  step={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo Border Size: {logoMargin}px</Label>
                <Slider
                  value={[logoMargin]}
                  onValueChange={(value) => setLogoMargin(value[0])}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            </>
          )}

          <Button onClick={downloadQR} className="w-full">
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default QRCodeGenerator
