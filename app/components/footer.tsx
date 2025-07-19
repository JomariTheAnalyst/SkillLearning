import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses/sql"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  SQL
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/python"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Python
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/excel"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Excel
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SkillLearn</h3>
            <p className="text-sm text-muted-foreground">
              Master SQL, Python, and Excel skills with our comprehensive learning platform.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SkillLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 