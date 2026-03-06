import bcrypt from "bcryptjs";

import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { User } from "../models/User";

export const seedInitialData = async (): Promise<void> => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("12345678", 12);

  const [admin, merchant, employee, customer] = await User.create([
    {
      userId: "SZ-ADMIN-1",
      fullName: "Super Admin",
      username: "admin",
      email: "admin@saleh.zone",
      password: passwordHash,
      role: "SuperAdmin",
      walletBalance: 0
    },
    {
      userId: "SZ-MERCHANT-1",
      fullName: "FastPay Merchant",
      username: "fastpay",
      email: "merchant@saleh.zone",
      password: passwordHash,
      role: "Merchant",
      walletBalance: 0,
      merchantTier: "Gold"
    },
    {
      userId: "SZ-EMP-1",
      fullName: "Support Employee",
      username: "support",
      email: "employee@saleh.zone",
      password: passwordHash,
      role: "Employee",
      walletBalance: 0
    },
    {
      userId: "SZ-USER-1",
      fullName: "Ahmed Customer",
      username: "ahmed",
      email: "user@saleh.zone",
      password: passwordHash,
      role: "Customer",
      walletBalance: 150
    }
  ]);

  const categories = await Category.create([
    { name: "PUBG", slug: "pubg", description: "PUBG UC top up" },
    { name: "Free Fire", slug: "free-fire", description: "Free Fire diamonds" },
    { name: "Steam", slug: "steam", description: "Steam wallets" }
  ]);

  const pubgCategory = categories[0];
  const freefireCategory = categories[1];
  const steamCategory = categories[2];

  await Product.create([
    {
      name: "PUBG 600 UC",
      slug: "pubg-600-uc",
      description: "Instant UC top-up",
      category: pubgCategory._id,
      productType: "DIRECT_TOPUP",
      basePrice: 10,
      image: "https://placehold.co/640x360/111827/5EEAD4?text=PUBG+600+UC",
      offers: [
        { merchant: merchant._id, price: 9.5, isActive: true },
        { merchant: admin._id, price: 10, isActive: true }
      ]
    },
    {
      name: "Free Fire 1080 Diamonds",
      slug: "free-fire-1080-diamonds",
      description: "Fast digital code",
      category: freefireCategory._id,
      productType: "PIN_BASED",
      basePrice: 15,
      image: "https://placehold.co/640x360/111827/5EEAD4?text=Free+Fire+1080",
      offers: [{ merchant: merchant._id, price: 14.5, isActive: true }]
    },
    {
      name: "Steam Wallet $20",
      slug: "steam-wallet-20",
      description: "Steam PIN code",
      category: steamCategory._id,
      productType: "PIN_BASED",
      basePrice: 20,
      image: "https://placehold.co/640x360/111827/5EEAD4?text=Steam+20",
      offers: [{ merchant: merchant._id, price: 19.2, isActive: true }]
    }
  ]);

  console.log("Seeded default users and catalog data.");
  console.log("Default credentials: admin@saleh.zone / 12345678, user@saleh.zone / 12345678");
  void employee;
  void customer;
};
