'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname() || "/";
  const router = useRouter(); 

  const navLinks = [
    { href: "/", label: "Galeria" },
    { href: "/register", label: "Alistamento" },
    { href: "/admin/login", label: "Admin" },
  ];

  const handleAdminClick = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("admin_token");

    if (token) {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-md border-b border-blue-900/30">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/">
          <img
            src="/logotipo-leadsoft-branco.svg"
            className="object-cover w-full h-15 rounded-t-xl"
            loading="lazy"
            alt="LeadSoft Logo"
          />
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.label === "Admin"
                ? pathname.startsWith("/admin")
                : pathname === link.href;

            if (link.label === "Admin") {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleAdminClick}
                  className={`cursor-pointer font-orbitron transition-colors pb-1 text-lg
                    ${
                      isActive
                        ? "border-b-2 border-[#60A8F4]"
                        : "text-white hover:border-b-2 border-[#60A8F4]"
                    }
                  `}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-orbitron transition-colors pb-1 text-lg
                  ${
                    isActive
                      ? "border-b-2 border-[#60A8F4]"
                      : "text-white hover:border-b-2 border-[#60A8F4]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}