import { useState } from "react"
import { X, Copy, Check, AlertCircle } from "lucide-react"

interface PasswordDisplayDialogProps {
  isOpen: boolean
  onClose: () => void
  password: string
  email: string
}

export default function PasswordDisplayDialog({ isOpen, onClose, password, email }: PasswordDisplayDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[rgba(189,198,103,0.3)]">
          <h2 className="text-xl font-semibold text-[rgba(84,67,67,1)]">Employee Created Successfully</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[rgba(189,198,103,0.1)] text-[rgba(84,67,67,0.7)] transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[rgba(189,198,103,0.1)] border border-[rgba(189,198,103,0.3)] rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-[rgba(119,150,109,1)] mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[rgba(84,67,67,0.9)]">
                <span className="font-semibold">Important:</span> This is the only time you'll see this password. Please
                save it securely. The employee will need these credentials to log in.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">Email</label>
              <div className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,0.5)] bg-[rgba(119,150,109,0.05)] text-[rgba(84,67,67,1)]">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">Password</label>
              <div className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,0.5)] bg-[rgba(119,150,109,0.05)] text-[rgba(84,67,67,1)] font-mono">
                {password}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-[rgba(119,150,109,1)] text-[rgba(119,150,109,1)] rounded-md hover:bg-[rgba(119,150,109,0.1)] transition-colors duration-200 flex items-center"
            >
              {copied ? (
                <>
                  <Check size={18} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} className="mr-2" />
                  Copy Credentials
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
