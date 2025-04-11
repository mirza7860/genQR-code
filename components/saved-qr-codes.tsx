"use client"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface SavedQRCodesProps {
  savedQRCodes: QRCodeData[]
  onDelete: (id: string) => void
}

export default function SavedQRCodes({ savedQRCodes, onDelete }: SavedQRCodesProps) {
  const downloadQRCode = (qrCode: QRCodeData) => {
    const svg = document.getElementById(`qr-code-${qrCode.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = qrCode.size
      canvas.height = qrCode.size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `${qrCode.name || "qrcode"}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (savedQRCodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6">
          <QRCodeSVG value="https://example.com" size={100} />
        </div>
        <h3 className="mt-4 text-xl font-semibold">No saved QR codes</h3>
        <p className="mt-2 text-muted-foreground">Create and save QR codes to see them here</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {savedQRCodes.map((qrCode) => (
        <Card key={qrCode.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="truncate text-lg">{qrCode.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4" style={{ backgroundColor: qrCode.backgroundColor }}>
              <QRCodeSVG
                id={`qr-code-${qrCode.id}`}
                value={qrCode.url}
                size={150}
                bgColor={qrCode.backgroundColor}
                fgColor={qrCode.foregroundColor}
                level="H"
                includeMargin={qrCode.includeMargin}
                imageSettings={
                  qrCode.shape === "dots"
                    ? {
                        src: "",
                        excavate: true,
                        height: 0,
                        width: 0,
                      }
                    : undefined
                }
                style={{
                  borderRadius: qrCode.shape === "rounded" ? "10px" : "0px",
                }}
              />
            </div>
            <div className="mt-4 space-y-1">
              <p className="truncate text-sm text-muted-foreground">URL: {qrCode.url}</p>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(qrCode.createdAt))} ago
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => downloadQRCode(qrCode)}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(qrCode.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
