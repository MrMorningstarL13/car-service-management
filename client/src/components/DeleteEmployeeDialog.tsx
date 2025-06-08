import { X, AlertTriangle, Loader2 } from "lucide-react"
import type { Employee } from "../pages/Employees"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  employee: Employee
  isLoading: boolean
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  employee,
  isLoading,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[rgba(189,198,103,0.3)]">
          <h2 className="text-xl font-semibold text-[rgba(84,67,67,1)] flex items-center">
            <AlertTriangle size={20} className="text-[rgba(86,40,45,1)] mr-2" />
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[rgba(189,198,103,0.1)] text-[rgba(84,67,67,0.7)] transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[rgba(84,67,67,0.9)] mb-4">
            Are you sure you want to delete the employee{" "}
            <span className="font-semibold">
              {employee.firstName} {employee.lastName}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[rgba(189,198,103,1)] text-[rgba(84,67,67,1)] rounded-md hover:bg-[rgba(189,198,103,0.1)] transition-colors duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[rgba(86,40,45,1)] hover:bg-[rgba(86,40,45,0.8)] text-white rounded-md transition-colors duration-200 flex items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
              Delete Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
