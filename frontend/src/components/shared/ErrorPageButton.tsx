// ErrorPageButton – en navigationsknap der bruges på fejlsider (404, 505 osv.).
// Fungerer som et link og modtager sin styling udefra via className-prop.

import Link from "next/link";

type ErrorPageButtonProps = {
  href: string;
  className: string;
  children: React.ReactNode;
};

export default function ErrorPageButton({
  href,
  className,
  children,
}: ErrorPageButtonProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
