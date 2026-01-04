export const metadata = {
  title: 'Invoice Dispute Copilot',
  description: 'RAG + Workflow (TypeScript)',
};

import './globals.css';
import { AppToaster } from '../components/ui/toaster';
import { fontSans } from './fonts';
import { Receipt, FileWarning, Search, FileText } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontSans.className} min-h-screen bg-gradient-to-b from-[#0b0f14] to-[#0e1420] text-fg`}>
        <header className="sticky top-0 border-b border-border bg-card/70 backdrop-blur">
          <div className="container">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-primary" />
                </div>
                <span className="text-lg font-semibold">Invoice Dispute Copilot</span>
              </div>
              <nav className="flex gap-2 text-sm">
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-3 py-1.5 flex items-center gap-2" href="/"><span>Dashboard</span></a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-3 py-1.5 flex items-center gap-2" href="/invoices"><FileText className="h-4 w-4" /><span>Invoices</span></a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-3 py-1.5 flex items-center gap-2" href="/disputes"><FileWarning className="h-4 w-4" /><span>Disputes</span></a>
                <a className="text-muted hover:text-fg hover:bg-primary/20 rounded px-3 py-1.5 flex items-center gap-2" href="/search"><Search className="h-4 w-4" /><span>Search</span></a>
              </nav>
            </div>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="border-t border-border mt-8">
          <div className="container py-6 text-muted">© {new Date().getFullYear()} IDC</div>
        </footer>
        <AppToaster />
      </body>
    </html>
  );
}
