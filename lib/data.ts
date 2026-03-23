import type { Product, Review, Order, CollectionPoint } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Petite Rose Box",
    description:
      "A beautiful small round hat box filled with soft pink and white roses arranged in a dome shape. Perfect for a thoughtful gesture or to brighten someone's day.",
    price: 650,
    image: "/images/product-petite-box.jpg",
    category: "boxed",
    stock: 15,
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: "2",
    name: "40 Red Roses",
    description:
      "A stunning bouquet of 40 fresh red roses wrapped in premium kraft paper with a satin ribbon. The classic romantic gesture, perfect for anniversaries and special occasions.",
    price: 600,
    image: "/images/product-roses.jpg",
    category: "roses",
    stock: 20,
    featured: true,
    bestSeller: false,
    rating: 4.9,
    reviewCount: 67,
  },
  {
    id: "3",
    name: "Heart Boxed Roses",
    description:
      "A luxury heart-shaped box filled with perfectly arranged red roses. The ultimate romantic gift for your loved one.",
    price: 2650,
    image: "/images/product-heart-box.jpg",
    category: "boxed",
    stock: 8,
    featured: false,
    bestSeller: true,
    rating: 5.0,
    reviewCount: 28,
  },
  {
    id: "4",
    name: "100 White Roses",
    description:
      "An extravagant bouquet of 100 fresh pure white roses. A breathtaking display of elegance and sophistication.",
    price: 2000,
    image: "/images/product-white-roses.jpg",
    category: "roses",
    stock: 5,
    featured: false,
    bestSeller: true,
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: "5",
    name: "Mixed Garden Bouquet",
    description:
      "A gorgeous mixed flower bouquet with pink peonies, white lilies, blush roses, and green foliage. Beautifully arranged by our expert florists.",
    price: 850,
    image: "/images/product-mixed-bouquet.jpg",
    category: "bouquets",
    stock: 12,
    featured: true,
    bestSeller: false,
    rating: 4.6,
    reviewCount: 35,
  },
  {
    id: "6",
    name: "Sunshine Sunflowers",
    description:
      "A cheerful bouquet of bright yellow sunflowers mixed with white daisies and greenery. Perfect to brighten any room.",
    price: 450,
    image: "/images/product-sunflowers.jpg",
    category: "bouquets",
    stock: 18,
    featured: true,
    bestSeller: false,
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: "7",
    name: "Infinity Love Box",
    description:
      "Our signature luxury arrangement featuring preserved roses in a premium black box. These roses last up to a year with no water needed.",
    price: 4000,
    image: "/images/product-heart-box.jpg",
    category: "valentines",
    stock: 3,
    featured: false,
    bestSeller: true,
    rating: 5.0,
    reviewCount: 15,
  },
  {
    id: "8",
    name: "Chocolate & Roses Hamper",
    description:
      "Elegant gift hamper combining beautiful roses with premium chocolates and a bottle of sparkling wine. The perfect celebration package.",
    price: 1250,
    image: "/images/category-treats.jpg",
    category: "treats",
    stock: 10,
    featured: false,
    bestSeller: false,
    rating: 4.8,
    reviewCount: 31,
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userName: "Thandi M.",
    rating: 5,
    comment:
      "Absolutely stunning arrangement! The roses were fresh and beautifully arranged. My wife loved it. Will definitely order again.",
  date: "2026-01-15",
  status: "approved",
  },
  {
  id: "2",
    productId: "2",
    userName: "Sarah K.",
    rating: 5,
    comment:
      "The delivery was on time and the flowers were perfect. They lasted over two weeks! Highly recommend this florist.",
  date: "2026-01-20",
  status: "approved",
  },
  {
  id: "3",
    productId: "3",
    userName: "James P.",
    rating: 5,
    comment:
      "The heart box was even more beautiful in person. My partner was so surprised. Worth every Rand!",
  date: "2026-02-01",
  status: "approved",
  },
  {
  id: "4",
    productId: "5",
    userName: "Nomsa D.",
    rating: 4,
    comment:
      "Lovely mixed bouquet, very fragrant and well-arranged. The only reason for 4 stars is I wished it was a bit bigger for the price.",
  date: "2026-01-28",
  status: "approved",
  },
  {
  id: "5",
    productId: "1",
    userName: "Lerato B.",
    rating: 5,
    comment:
      "I've ordered from Peter Rose three times now and every single time, the flowers are impeccable. Best florist in SA!",
  date: "2026-02-05",
  status: "approved",
  },
  {
  id: "6",
    productId: "6",
    userName: "Michael R.",
    rating: 5,
    comment:
      "Same-day delivery and the sunflowers were gorgeous. Made my mom's birthday extra special. Thank you!",
date: "2026-01-10",
  status: "approved",
  },
  ];

  export const sampleOrders: Order[] = [
  {
    id: "ORD-2026-001",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[5], quantity: 2 },
    ],
    status: "out-for-delivery",
    deliveryMethod: "delivery",
    deliveryDate: "2026-02-09",
    deliveryTime: "14:00",
    deliveryCost: 150,
    subtotal: 1550,
    total: 1700,
    customer: {
      firstName: "Thandi",
      lastName: "Mokoena",
      email: "thandi@example.com",
      phone: "+27 82 123 4567",
      address: "15 Main Road, Sandton",
      city: "Johannesburg",
      postalCode: "2196",
      province: "Gauteng",
    },
    createdAt: "2026-02-09T08:30:00Z",
    trackingUpdates: [
      {
        status: "Order Placed",
        timestamp: "2026-02-09T08:30:00Z",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Order Confirmed",
        timestamp: "2026-02-09T09:00:00Z",
        description: "Payment confirmed. Our florists are preparing your arrangement.",
      },
      {
        status: "Being Prepared",
        timestamp: "2026-02-09T10:30:00Z",
        description: "Your beautiful flowers are being arranged with care.",
      },
      {
        status: "Out for Delivery",
        timestamp: "2026-02-09T13:00:00Z",
        description: "Your order is on its way to you!",
      },
    ],
  },
];

// export const collectionPoints: CollectionPoint[] = [
//   {
//     id: "cp-1",
//     name: "Sandton City",
//     address: "163 Rivonia Road, Sandton, 2196",
//     province: "Gauteng",
//     hours: "Mon-Sat: 9:00 - 17:00",
//   },
//   {
//     id: "cp-2",
//     name: "Rosebank Mall",
//     address: "50 Bath Avenue, Rosebank, 2196",
//     province: "Gauteng",
//     hours: "Mon-Sat: 9:00 - 17:00",
//   },
//   {
//     id: "cp-3",
//     name: "Menlyn Park",
//     address: "Atterbury Road, Menlyn, 0181",
//     province: "Gauteng",
//     hours: "Mon-Sat: 9:00 - 17:00",
//   },
//   {
//     id: "cp-4",
//     name: "V&A Waterfront",
//     address: "19 Dock Road, V&A Waterfront, 8001",
//     province: "Western Cape",
//     hours: "Mon-Sat: 9:00 - 18:00",
//   },
//   {
//     id: "cp-5",
//     name: "Gateway Theatre",
//     address: "1 Palm Boulevard, Umhlanga, 4319",
//     province: "KwaZulu-Natal",
//     hours: "Mon-Sat: 9:00 - 17:00",
//   },
// ];

export const DELIVERY_FEE = 150;

export const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

export function canDeliverSameDay(): boolean {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(12, 0, 0, 0);
  return now < cutoff && !isSunday(now);
}

export function getAvailableDeliveryDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (!isSunday(date)) {
      if (i === 0 && !canDeliverSameDay()) continue;
      dates.push(date);
    }
  }
  return dates;
}

export function formatPrice(price: number): string {
  return `R${price.toLocaleString("en-ZA")}`;
}

export function getDeliveryTimeSlots(): string[] {
  return [
    "09:00 - 11:00",
    "11:00 - 13:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
  ];
}
