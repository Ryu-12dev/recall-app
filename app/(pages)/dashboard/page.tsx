import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma/prisma"
import DashboardClient from "./DashboardClient"

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const decks = await prisma.decks.findMany({
    where: { userId: user!.id }
  })

  return <DashboardClient decks={decks} />
}
