export const metadata = {
  title: 'Invoice Dispute Copilot',
  description: 'RAG + Workflow (TypeScript)',
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1>Invoice Dispute Copilot</h1>
            <nav className="nav">
              <a href="/">Dashboard</a>
              <a href="/invoices">Invoices</a>
              <a href="/disputes">Disputes</a>
              <a href="/search">Search</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">© {new Date().getFullYear()} IDC</div>
        </footer>
      </body>
    </html>
  );
}
