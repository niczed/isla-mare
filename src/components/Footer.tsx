import { MapPin, Phone, Mail, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground px-4 py-12 text-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-bold">
              Isla Maré <span className="font-script text-primary">Resort</span>
            </h3>
            <p className="text-background/80">
              Where Every Stay Feels Like the Maldives
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+63 934-137-2634</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span>www.islamare.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>Hello@islamare.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>Barangay Bacungan, Sitio Tagkawayanan, Puerto Princesa City, Palawan 5300</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Hours</h4>
            <div className="space-y-2 text-background/80">
              <p>Check-in: 2:00 PM</p>
              <p>Check-out: 11:00 AM</p>
              <p>Front Desk: 24/7</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-background/20 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 Isla Maré Resort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
