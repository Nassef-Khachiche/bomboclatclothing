function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em]">Bomboclat Clothing</p>
          <p className="mt-3 text-sm text-zinc-600">Minimal luxury essentials made for everyday rotation.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">Support</p>
          <p className="mt-2 text-sm text-zinc-600">support@bomboclat.com</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em]">Shipping</p>
          <p className="mt-2 text-sm text-zinc-600">Worldwide delivery within 5-10 business days.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
