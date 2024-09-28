import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// import { ClerkProvider } from "@clerk/nextjs";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IBMPlex = IBM_Plex_Sans({
  // src: "./fonts/GeistVF.woff",
  subsets: ['latin'],
  variable: "--font-ibm-plex",
  weight: ['400', '500', '600', '700'],
});
// const geistMono = IBM_Plex_Sans({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Imaginify",
  description: "AI-powered Image generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider afterSignOutUrl="/">
    //   <html lang="en">
    //     <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          
    //       {children}
    //     </body>
    //   </html>
    // </ClerkProvider>
    <ClerkProvider >
      <html lang="en">
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          <header>
         
            {/* <SignedOut>
             <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> */}
            <SignedOut>
                        <Button asChild className='button bg-purple-gradient bg-cover'>
                            <Link href="/sign-in">Login</Link>
                        </Button>
                        <Button asChild className='button bg-purple-gradient bg-cover'>
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </SignedOut>
          </header>
          {/* <UserButton ></UserButton> */}
          <main> {children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
