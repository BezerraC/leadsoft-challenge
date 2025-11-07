import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-blue-900/30 mt-auto">
      <div className="flex flex-row justify-between max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-gray font-roboto-mono">
        <p>&copy; {new Date().getFullYear()} - BezerraC</p>
        <Link className="underline" href="https://github.com/BezerraC/leadsoft-challenge">
          Repositório
        </Link>
      </div>
    </footer>
  );
}
