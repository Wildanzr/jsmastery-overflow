import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
