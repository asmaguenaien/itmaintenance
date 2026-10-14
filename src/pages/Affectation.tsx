import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  type: string;
  assigned_to: string | null;
}

interface Profile {
  user_id: string;
  username: string;
}

export default function Affectation() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const fetchData = async () => {
    const [eqRes, usersRes] = await Promise.all([
      supabase.from("equipments").select("id, name, type, assigned_to").order("name"),
      supabase.from("profiles").select("user_id, username"),
    ]);
    setEquipments(eqRes.data || []);
    setUsers(usersRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (equipmentId: string) => {
    const userId = selections[equipmentId];
    if (!userId) { toast.error("Sélectionnez un utilisateur"); return; }
    const { error } = await supabase.from("equipments").update({ assigned_to: userId, status: "affecté" }).eq("id", equipmentId);
    if (error) toast.error(error.message);
    else { toast.success("Équipement affecté !"); fetchData(); }
  };

  const getUsername = (userId: string | null) => {
    if (!userId) return "Non affecté";
    return users.find((u) => u.user_id === userId)?.username || "Inconnu";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Affectation</h1>
        <p className="text-muted-foreground">Affecter les équipements aux utilisateurs</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Affecté à</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipments.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell className="capitalize">{eq.type}</TableCell>
                  <TableCell>{getUsername(eq.assigned_to)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select value={selections[eq.id] || ""} onValueChange={(v) => setSelections({ ...selections, [eq.id]: v })}>
                        <SelectTrigger className="w-48"><SelectValue placeholder="Utilisateur..." /></SelectTrigger>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.user_id} value={u.user_id}>{u.username}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleAssign(eq.id)}>Affecter</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
