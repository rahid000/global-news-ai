export function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Global News AI. All rights reserved.</p>
        <p className="mt-1">Powered by AI, curated for you.</p>
      </div>
    </footer>
  );
}
