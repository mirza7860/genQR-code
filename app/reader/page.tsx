"use client"

import { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, LinkIcon, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function QRCodeReader() {
  const { toast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<{ url: string; timestamp: string }[]>([])
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null)
  const [cameraId, setCameraId] = useState<string | null>(null)
  const [cameraList, setCameraList] = useState<{ id: string; label: string }[]>([])
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  const isValidUrl = (text: string) => {
    try {
      const url = new URL(text)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch (_) {
      return false
    }
  }

  useEffect(() => {
    const history = localStorage.getItem("qrScanHistory")
    if (history) {
      setScanHistory(JSON.parse(history))
    }

    const qrCodeScanner = new Html5Qrcode("qr-reader")
    setHtml5QrCode(qrCodeScanner)

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameras = devices.map((device) => ({
            id: device.id,
            label: device.label || `Camera ${device.id}`,
          }))
          setCameraList(cameras)
          setCameraId(devices[0].id)
          setPermissionGranted(true)
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err)
        setPermissionGranted(false)
      })

    return () => {
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch((err) => console.error("Error stopping scanner", err))
      }
    }
  }, [])

  const startScanner = async () => {
    if (!html5QrCode || !cameraId) return

    try {
      setScanning(true)
      setScanResult(null)

      const qrCodeSuccessCallback = (decodedText: string) => {
        handleScanSuccess(decodedText)
      }

      const config = { fps: 10, qrbox: { width: 250, height: 250 } }
      await html5QrCode.start(cameraId, config, qrCodeSuccessCallback, undefined)
    } catch (err) {
      console.error("Error starting scanner", err)
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      })
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop()
        setScanning(false)
      } catch (err) {
        console.error("Error stopping scanner", err)
      }
    }
  }

  const handleScanSuccess = (decodedText: string) => {
    stopScanner()
    setScanResult(decodedText)

    const newScan = { url: decodedText, timestamp: new Date().toISOString() }
    const updatedHistory = [newScan, ...scanHistory].slice(0, 10)
    setScanHistory(updatedHistory)
    localStorage.setItem("qrScanHistory", JSON.stringify(updatedHistory))

    toast({
      title: "QR Code Scanned",
      description: "Successfully scanned QR code",
    })
  }

  const handleCameraChange = (newCameraId: string) => {
    if (scanning && html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          setCameraId(newCameraId)
          startScanner()
        })
        .catch((err) => console.error("Error switching camera", err))
    } else {
      setCameraId(newCameraId)
    }
  }

  const openUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank")
    } else {
      window.open(`https://${url}`, "_blank")
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !html5QrCode) return

    try {
      const result = await html5QrCode.scanFile(file, true)
      handleScanSuccess(result)
    } catch (err) {
      console.error("Image scan failed", err)
      toast({
        title: "Image Scan Failed",
        description: "Could not detect a QR code in the uploaded image.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">QR Code Reader</h1>

      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Use your camera or upload an image</CardDescription>
              </CardHeader>
              <CardContent>
                {permissionGranted === false && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to scan QR codes. You may need to update your browser settings.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mb-4">
                  {cameraList.length > 1 && (
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium">Select Camera</label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={cameraId || ""}
                        onChange={(e) => handleCameraChange(e.target.value)}
                        disabled={scanning}
                      >
                        {cameraList.map((camera) => (
                          <option key={camera.id} value={camera.id}>
                            {camera.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div
                    id="qr-reader"
                    className="overflow-hidden rounded-lg border"
                    style={{ width: "100%", minHeight: "300px" }}
                  ></div>
                </div>

                <div className="my-4 text-center">
                  <label className="mb-2 block text-sm font-medium">Or upload an image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                  />
                </div>

                <div className="flex justify-center">
                  {!scanning ? (
                    <Button onClick={startScanner} disabled={!cameraId || permissionGranted === false}>
                      <Camera className="mr-2 h-4 w-4" /> Start Scanning
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={stopScanner}>
                      Stop Scanning
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan Result</CardTitle>
                <CardDescription>The content of the scanned QR code will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>QR Code Detected</AlertTitle>
                      <AlertDescription className="break-all">{scanResult}</AlertDescription>
                    </Alert>

                    {isValidUrl(scanResult) && (
                      <div className="flex justify-center">
                        <Button onClick={() => openUrl(scanResult)}>
                          <LinkIcon className="mr-2 h-4 w-4" /> Open URL
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                    <Camera className="mb-2 h-12 w-12" />
                    <p>No QR code scanned yet</p>
                    <p className="text-sm">Scan a QR code to see the result here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>Your recent QR code scans</CardDescription>
            </CardHeader>
            <CardContent>
              {scanHistory.length > 0 ? (
                <div className="space-y-4">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="overflow-hidden">
                        <p className="truncate font-medium">{scan.url}</p>
                        <p className="text-sm text-muted-foreground">{new Date(scan.timestamp).toLocaleString()}</p>
                      </div>
                      {isValidUrl(scan.url) && (
                        <Button variant="outline" size="sm" onClick={() => openUrl(scan.url)}>
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                  <p>No scan history</p>
                  <p className="text-sm">Scanned QR codes will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
