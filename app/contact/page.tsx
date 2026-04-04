import { ContactPageContent } from "@/components/ContactPageContent";
import { PublicPageShell } from "@/components/PublicPageShell";
import { academyData } from "@/lib/academy";

export default function ContactPage() {
  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Visit a center, open the live map, or send the academy a message."
      description="This route adds a dedicated contact experience to the public site with location cards, embedded maps, and a real enquiry form connected to your backend."
    >
      <ContactPageContent
        centers={academyData.contactCenters}
        academyEmail={academyData.email}
        academyPhone={academyData.phone}
      />
    </PublicPageShell>
  );
}
