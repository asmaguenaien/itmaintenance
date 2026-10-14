import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Wrench, MessageSquareWarning, Users } from "lucide-react";

export default function Dashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ equipments: 0, maintenance: 0, reclamations: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [eq, mt, rc] = await Promise.all([
        supabase.from("equipments").select("id", { count: "exact", head: true }),
        supabase.from("maintenance_reports").select("id", { count: "exact", head: true }),
        supabase.from("reclamations").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        equipments: eq.count || 0,
        maintenance: mt.count || 0,
        reclamations: rc.count || 0,
        users: 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Équipements", value: stats.equipments, icon: Monitor, color: "text-primary" },
    { title: "Maintenances", value: stats.maintenance, icon: Wrench, color: "text-orange-500" },
    { title: "Réclamations", value: stats.reclamations, icon: MessageSquareWarning, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre parc informatique</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
