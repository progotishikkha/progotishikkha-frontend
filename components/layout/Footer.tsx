import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Linkedin } from "lucide-react";
import { Container } from "./Container";

const FOOTER_LINKS = {
  Platform: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  "Get started": [
    { href: "/register/student", label: "Find a tutor" },
    { href: "/register/tutor", label: "Become a tutor" },
    { href: "/login", label: "Log in" },
  ],
  Legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/5 dark:bg-slate-950">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="Progoti Shikkha" width={36} height={36} className="rounded-full" />
            <span className="font-display text-lg font-semibold text-brand-navy dark:text-white">
              Progoti Shikkha
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            শিখবো, জানবো, গড়বো আগামি — connecting students with trusted, verified
            tutors across Bangladesh.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Youtube, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-navy transition-colors hover:bg-brand-blue hover:text-white dark:bg-white/5 dark:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h3 className="text-sm font-semibold text-brand-navy dark:text-white">{heading}</h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-brand-blue dark:text-slate-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-black/5 py-6 dark:border-white/5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Progoti Shikkha. All rights reserved.</p>
          <p>Made with care for students and tutors across Bangladesh.</p>
        </Container>
      </div>
    </footer>
  );
}
