"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background border border-neutral-800 rounded-xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-neutral-800 bg-background rounded-t-xl">
          <h2 className="text-2xl font-bold text-white font-heading">Terms of Service</h2>
          <Button variant="outline" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="p-6 max-h-[calc(90vh-80px)]">
          <div className="p-6 max-h-[calc(90vh-80px)]">
            <div className="space-y-6">
              <div>
                <p className="text-neutral-300">Last Updated: May 8, 2025</p>
              </div>

              <div className="space-y-6 text-neutral-300">
                <h3 className="text-xl font-bold text-white font-heading">1. Introduction</h3>
                <p>
                  1.1) By agreeing to this terms we can make sure we both are on the same page and won't have any
                  conflicts in future.
                </p>
                <p>
                  1.2) If you fail to follow these terms and conditions there will be no refund given if any or if no
                  payment is made the project would be declared cancelled.
                </p>
                <p>1.3) Make sure you read through each and every point before moving forward.</p>

                <h3 className="text-xl font-bold text-white font-heading">2. RULES AND REGULATIONS</h3>
                <p>2.1) Any payment above 3000robux(10$), would need to be paid 50% upfront.</p>
                <p>OR</p>
                <p>2.2) A legitimate proof that the payment will be done.</p>
                <p>
                  2.3) We both understand the boundaries and respect that we should have for each other so PLEASE do not
                  cross it.
                </p>
                <p>
                  2.4) Minor changes are okay but asking for major changes after finalzying the work and the payment,
                  will require extra charge.
                </p>

                <h3 className="text-xl font-bold text-white font-heading">3. CONFIDENTIALITY</h3>
                <p>
                  3.1) You hereby agree when you start working with me that the builds i make for you, i can use it for
                  my portfolio( unless and untill its meant to not be published)
                </p>
                <p>3.2) I will make sure no information about the game gets leaked without your permission.</p>
                <p>
                  3.3) When you write a review for my work you make sure you are allowing me to use your discord id and
                  profile pic as a showcase in my portfolio
                </p>

                <p className="font-bold text-white mt-6">
                  BY CONTINUING WORKING WITH ME YOU MAKE SURE YOU HAVE READ THROUGH THE TERMS OF SERVICES AND HAVE
                  REACHED ON A CONCLUSION OF "AGREEING" TO IT.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 z-10 flex justify-end p-4 border-t border-neutral-800 bg-background rounded-b-xl">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
