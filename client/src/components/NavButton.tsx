import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"

interface NavButtonProps {
    icon: LucideIcon
    label: string
    href: string
    isActive?: boolean
    onClick?: () => void
    isMobile?: boolean
}

const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(" ")
}

export default function NavButton({
    icon: Icon,
    label,
    href,
    isActive = false,
    onClick,
    isMobile = false,
}: NavButtonProps) {
    if (!isMobile) {
        return (
            <Link
                to={href}
                className={cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    isActive
                        ? "bg-[rgba(119,150,109,0.4)] text-contrast-secondary font-medium"
                        : "text-contrast-primary hover:text-contrast-secondary hover:bg-[rgba(189,198,103,0.8)]",
                )}
                onClick={onClick}
            >
                <Icon className="mr-2 h-5 w-5" />
                {label}
            </Link>
        )
    }

    return (
        <Link
            to={href}
            className={cn(
                "flex items-center px-4 py-2 rounded-md",
                isActive
                    ? "bg-[rgba(119,150,109,0.3)] text-contrast-secondary font-medium"
                    : "text-contrast-primary hover:bg-[rgba(119,150,109,0.3)]",
            )}
            onClick={onClick}
        >
            <Icon className="mr-2 h-5 w-5" />
            {label}
        </Link>
    )
}
