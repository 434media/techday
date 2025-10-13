"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  target?: string
  rel?: string
  ariaLabel?: string
}

export function AnimatedButton({
  children,
  onClick,
  href,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  target,
  rel,
  ariaLabel,
}: AnimatedButtonProps) {
  // Base styles
  const baseStyles =
    "relative overflow-hidden font-semibold uppercase tracking-wide rounded-sm transition-colors duration-300 focus-visible:outline-offset-4 focus-visible:outline-2"

  // Variant styles
  const variantStyles = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    secondary: "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 focus-visible:outline-red-600",
  }

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  // Width styles
  const widthStyles = fullWidth ? "w-full" : ""

  // Disabled styles
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : ""

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`

  // Animated squares animation variants
  const squareVariants = {
    hover: {
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const, // cubic-bezier easing as tuple
      },
    },
  }

  const buttonContent = (
    <>
      {/* Animated squares that slide in from left on hover */}
      <motion.div
        className="absolute top-0 left-0 h-full w-full pointer-events-none"
        variants={squareVariants}
        initial={{ x: "-100%" }}
      >
        <div className="h-full w-full flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full bg-black"
              style={{ width: "5%" }}
              variants={{
                hover: {
                  opacity: [0, 1, 1, 0],
                  transition: {
                    duration: 0.6,
                    delay: i * 0.02,
                    ease: [0.4, 0, 0.2, 1] as const, // cubic-bezier easing as tuple
                  },
                },
              }}
              initial={{ opacity: 0 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center h-full w-full">{children}</span>
    </>
  )

  // If href is provided, render as a link
  if (href) {
    return (
      <motion.a href={href} className="block" target={target} rel={rel} aria-label={ariaLabel}>
        <motion.div
          className={combinedStyles}
          whileHover={disabled ? undefined : "hover"}
          whileTap={disabled ? undefined : { scale: 0.98 }}
        >
          {buttonContent}
        </motion.div>
      </motion.a>
    )
  }

  // Otherwise render as a button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      aria-label={ariaLabel}
    >
      {buttonContent}
    </motion.button>
  )
}
