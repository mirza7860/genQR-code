import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Create Custom QR Codes in Seconds
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Design, generate, and manage beautiful QR codes for your business or personal use. Customize colors,
                shapes, and more with our easy-to-use tool.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/generator">
                <Button size="lg" className="gap-1.5">
                  Create QR Code <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reader">
                <Button size="lg" variant="outline">
                  Scan QR Code
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-4 shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[250px] w-[250px] rounded-md bg-white p-4 shadow-sm">
                  <div className="h-full w-full bg-black/90 rounded-sm flex items-center justify-center">
                    <div className="text-white text-lg font-medium">GenQR</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary"></div>
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-secondary"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
