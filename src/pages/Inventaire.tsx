import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  status: string;
}

export default function Inventaire() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("equipments").select("*").order("name");
      setEquipments(data || []);
    };
    fetch();
  }, []);

  const filtered = equipments.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    (e.serial_number || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    switch (s) {
      case "disponible": return "bg-green-100 text-green-800";
      case "en_maintenance": return "bg-orange-100 text-orange-800";
      case "affecté": return "bg-blue-100 text-blue-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
        <p className="text-muted-foreground">Vue complète du parc matériel</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>N° Série</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun résultat</TableCell></TableRow>
              ) : filtered.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell className="capitalize">{eq.type}</TableCell>
                  <TableCell>{eq.brand || "—"}</TableCell>
                  <TableCell>{eq.model || "—"}</TableCell>
                  <TableCell className="font-mono text-sm">{eq.serial_number || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(eq.status)}>{eq.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
