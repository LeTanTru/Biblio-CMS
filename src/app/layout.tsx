import './globals.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import NextTopLoader from 'nextjs-toploader';
import { Suspense } from 'react';
import { AppProvider, QueryProvider } from '@/components/providers';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Metadata } from 'next';
import { PermissionGuard } from '@/components/permission-guard';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    template: '%s | Biblio CMS',
    default: 'Biblio CMS'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang={'vi'}>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppProvider>
              <Suspense>
                <PermissionGuard>{children}</PermissionGuard>
              </Suspense>
              <NextTopLoader showSpinner={false} />
            </AppProvider>
          </QueryProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
