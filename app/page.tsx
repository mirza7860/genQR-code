import Hero from "@/components/hero"
import Features from "@/components/features"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:gap-6">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} GenQR. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
