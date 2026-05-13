import { Link } from "wouter";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Map className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-2">404</h1>
        <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/">
          <Button data-testid="button-go-home">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
