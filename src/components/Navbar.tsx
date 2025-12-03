import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Home } from "lucide-react";

export const Navbar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-foreground">
          ISLA MARÉ
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/accommodations">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Accommodations
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
