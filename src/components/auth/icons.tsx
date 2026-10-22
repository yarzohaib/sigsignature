export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#0f172a" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#245FD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LinkedInBrandIcon({ className = "h-[19px] w-[19px]" }: { className?: string }) {
  return (
    <svg
      viewBox="172.1 235.1 19 19"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LinkedIn"
      role="img"
    >
      <rect
        x="172.1"
        y="235.1"
        width="19"
        height="19"
        rx="5"
        className="fill-[#F5F3EF] transition-colors group-hover:fill-[#EBE8E2]"
      />
      <path
        d="M178.988 241.1C178.988 241.366 178.889 241.62 178.711 241.807C178.534 241.995 178.294 242.1 178.044 242.1C177.793 242.1 177.553 241.994 177.376 241.807C177.199 241.619 177.099 241.365 177.1 241.099C177.1 240.834 177.199 240.58 177.377 240.392C177.554 240.205 177.794 240.1 178.044 240.1C178.295 240.1 178.535 240.206 178.712 240.393C178.889 240.581 178.989 240.835 178.988 241.1ZM179.017 242.84H177.128V249.1H179.017V242.84ZM182.001 242.84H180.122V249.1H181.982V245.815C181.982 243.985 184.234 243.815 184.234 245.815V249.1H186.1V245.135C186.1 242.05 182.766 242.165 181.982 243.68L182.001 242.84Z"
        className="fill-[#022977] transition-colors group-hover:fill-[#245FD4]"
      />
    </svg>
  );
}

export function XBrandIcon({ className = "h-[19px] w-[19px]" }: { className?: string }) {
  return (
    <svg
      viewBox="203.1 235.1 19 19"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="X (formerly Twitter)"
      role="img"
    >
      <rect
        x="203.1"
        y="235.1"
        width="19"
        height="19"
        rx="5"
        className="fill-[#F5F3EF] transition-colors group-hover:fill-[#EBE8E2]"
      />
      <path
        d="M216.55 239.1H218.39L214.37 243.759L219.1 250.1H215.397L212.494 246.255L209.177 250.1H207.335L211.635 245.115L207.1 239.101H210.897L213.516 242.615L216.55 239.1ZM215.902 248.983H216.922L210.34 240.159H209.246L215.902 248.983Z"
        className="fill-[#022977] transition-colors group-hover:fill-slate-900"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

export function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}