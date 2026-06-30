import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  const password = await bcrypt.hash("password123", 12)

  const users = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password,
      role: "USER" as const,
    },
    {
      name: "Kiran Tej (CEO)",
      email: "ceo@example.com",
      password,
      role: "CEO" as const,
    },
    {
      name: "Bob Smith (MD1)",
      email: "md1@example.com",
      password,
      role: "MD1" as const,
    },
    {
      name: "Carol Williams (MD2)",
      email: "md2@example.com",
      password,
      role: "MD2" as const,
    },
  ]

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    })
    if (!existing) {
      await prisma.user.create({ data: user })
      console.log(`Created user: ${user.email}`)
    } else {
      console.log(`User already exists: ${user.email}`)
    }
  }

  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
