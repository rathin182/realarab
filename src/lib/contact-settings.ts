export type ContactCard = {
  id: string;
  sortOrder: number;
  label: string;
  badge: string;
  title: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  visitingHours: string;
};

export const DEFAULT_CONTACT_CARDS: ContactCard[] = [
  {
    id: "contact_riyadh",
    sortOrder: 0,
    label: "KINGDOM HEADQUARTERS",
    badge: "",
    title: "Riyadh Sovereign HQ",
    address: "King Fahd Road, Al Olaya Financial District, Riyadh 12214, Kingdom of Saudi Arabia",
    phonePrimary: "+966 11 456 7890",
    phoneSecondary: "+966 50 123 4567",
    email: "riyadh@najmestates.sa",
    visitingHours: "Sun – Thu, 09:00 – 18:00 AST",
  },
  {
    id: "contact_international",
    sortOrder: 1,
    label: "INTERNATIONAL HUB",
    badge: "GLOBAL SALON",
    title: "Hyderabad International Hub",
    address: "Jubilee Hills / HITEC Corridor, Hyderabad, Telangana 500033, India",
    phonePrimary: "+91 40 6789 0123",
    phoneSecondary: "+91 98 7654 3210",
    email: "hyderabad@najmestates.sa",
    visitingHours: "Mon – Sat, 10:00 – 19:00 IST",
  },
];
