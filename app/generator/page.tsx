"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Download, Save } from "lucide-react"
import SavedQRCodes from "@/components/saved-qr-codes"
import { useToast } from "@/hooks/use-toast"

interface QRCodeData {
  id: string
  url: string
  backgroundColor: string
  foregroundColor: string
  shape: string
  size: number
  includeMargin: boolean
  name: string
  createdAt: string
}

export default function QRCodeGenerator() {
  const { toast } = useToast()
  const [url, setUrl] = useState("https://example.com")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [shape, setShape] = useState("square")
  const [size, setSize] = useState(200)
  const [includeMargin, setIncludeMargin] = useState(true)
  const [name, setName] = useState("")
  const [savedQRCodes, setSavedQRCodes] = useState<QRCodeData[]>([])
  const [activeTab, setActiveTab] = useState("create")

  useEffect(() => {
    const savedCodes = localStorage.getItem("savedQRCodes")
    if (savedCodes) {
      setSavedQRCodes(JSON.parse(savedCodes))
    }
  }, [])

  const saveQRCode = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL for your QR code",
        variant: "destructive",
      })
      return
    }

    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a name for your QR code",
        variant: "destructive",
      })
      return
    }

    const newQRCode: QRCodeData = {
      id: uuidv4(),
      url,
      backgroundColor,
      foregroundColor,
      shape,
      size,
      includeMargin,
      name,
      createdAt: new Date().toISOString(),
    }

    const updatedQRCodes = [...savedQRCodes, newQRCode]
    setSavedQRCodes(updatedQRCodes)
    localStorage.setItem("savedQRCodes", JSON.stringify(updatedQRCodes))

    toast({
      title: "Success",
      description: "QR code saved successfully",
    })

    setName("")
  }

  const deleteQRCode = (id: string) => {
    const updatedQRCodes = savedQRCodes.filter((code) => code.id !== id)
    setSavedQRCodes(updatedQRCodes)
    localStorage.setItem("savedQRCodes", JSON.stringify(updatedQRCodes))

    toast({
      title: "Deleted",
      description: "QR code deleted successfully",
    })
  }

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `${name || "qrcode"}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">QR Code Generator</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create QR Code</TabsTrigger>
          <TabsTrigger value="saved">Saved QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">QR Code Name</Label>
                <Input id="name" placeholder="My QR Code" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foregroundColor">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="foregroundColor"
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape">Shape Style</Label>
                <Select value={shape} onValueChange={setShape}>
                  <SelectTrigger id="shape">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="size">Size: {size}px</Label>
                </div>
                <Slider
                  id="size"
                  min={100}
                  max={400}
                  step={10}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeMargin"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="includeMargin">Include Margin</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveQRCode} className="flex-1">
                  <Save className="mr-2 h-4 w-4" /> Save QR Code
                </Button>
                <Button onClick={downloadQRCode} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border p-6">
              <div className="flex items-center justify-center rounded-lg p-4" style={{ backgroundColor }}>
                <QRCodeSVG
                  id="qr-code"
                  value={url || "https://example.com"}
                  size={size}
                  bgColor={backgroundColor}
                  fgColor={foregroundColor}
                  level="H"
                  includeMargin={includeMargin}
                  imageSettings={
                    shape === "dots"
                      ? {
                          src: "",
                          excavate: true,
                          height: 0,
                          width: 0,
                        }
                      : undefined
                  }
                  style={{
                    borderRadius: shape === "rounded" ? "10px" : "0px",
                  }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">{url || "https://example.com"}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedQRCodes savedQRCodes={savedQRCodes} onDelete={deleteQRCode} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
