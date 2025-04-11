import { CheckCircle, Palette, Save, Shapes, Camera } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to create perfect QR codes
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our QR code generator provides all the tools you need to create customized QR codes that match your brand
              or personal style.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Customizable Colors</h3>
              <p className="text-muted-foreground">
                Choose from a wide range of background colors to match your brand identity or personal preference.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shapes className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Custom Shapes & Designs</h3>
              <p className="text-muted-foreground">
                Personalize your QR codes with different shapes and design elements to make them stand out.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Local Storage</h3>
              <p className="text-muted-foreground">
                Save and manage your generated QR codes locally on your device for easy access and future use.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Easy to Use</h3>
              <p className="text-muted-foreground">
                Our intuitive interface makes it simple to create, customize, and download your QR codes in seconds.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">QR Code Scanner</h3>
              <p className="text-muted-foreground">
                Scan QR codes using your device's camera and easily access the encoded content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
