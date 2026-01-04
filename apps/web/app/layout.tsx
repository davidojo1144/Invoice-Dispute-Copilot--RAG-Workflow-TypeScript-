export const metadata = {
  title: 'Invoice Dispute Copilot',
  description: 'RAG + Workflow (TypeScript)',
};

import './globals.css';
import { AppToaster } from '../components/ui/toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-fg">
        <header className="sticky top-0 border-b border-border bg-card/60 backdrop-blur">
          <div className="container">
            <div className="flex items-center justify-between py-3">
              <h1 className="text-lg font-semibold">Invoice Dispute Copilot</h1>
              <nav className="flex gap-4 text-sm">
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-2 py-1" href="/">Dashboard</a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-2 py-1" href="/invoices">Invoices</a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-2 py-1" href="/disputes">Disputes</a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-2 py-1" href="/search">Search</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="container py-4">{children}</main>
        <footer className="border-t border-border mt-6">
          <div className="container py-4">© {new Date().getFullYear()} IDC</div>
        </footer>
        <AppToaster />
      </body>
    </html>
  );
}
