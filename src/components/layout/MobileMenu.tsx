"use client";

import Link from "next/link";
import { X, Instagram, Facebook, Twitter } from "lucide-react";
import { useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
];

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <span className="text-xl font-light uppercase tracking-[0.3em] text-brand-dark">
            Mela
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-brand-gray transition-colors hover:bg-gray-100 hover:text-brand-dark"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="border-b border-gray-100 py-5 text-2xl font-light uppercase tracking-[0.2em] text-brand-dark transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 px-8 py-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-brand-gray">
            Follow us
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-brand-gray transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
