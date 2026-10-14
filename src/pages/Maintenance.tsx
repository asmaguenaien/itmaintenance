import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface MaintenanceReport {
  id: string;
  description: string;
  status: string;
  date_debut: string;
  date_fin: string | null;
  equipment_id: string;
  equipments?: { name: string } | null;
}

export default function Maintenance() {
  const { user } = useAuth();
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [equipments, setEquipments] = useState<{ id: string; name: string }[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ equipment_id: "", description: "" });

  const fetchData = async () => {
    const [rRes, eRes] = await Promise.all([
      supabase.from("maintenance_reports").select("*, equipments(name)").order("created_at", { ascending: false }),
      supabase.from("equipments").select("id, name"),
    ]);
    setReports(rRes.data || []);
    setEquipments(eRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.equipment_id || !form.description) { toast.error("Tous les champs sont requis"); return; }
    const { error } = await supabase.from("maintenance_reports").insert({
      equipment_id: form.equipment_id,
      technician_id: user!.id,
      description: form.description,
    });
    if (error) toast.error(error.message);
    else { toast.success("Rapport créé !"); setAddOpen(false); setForm({ equipment_id: "", description: "" }); fetchData(); }
  };

  const updateStatus = async (id: string, status: string) => {
    const update: Record<string, string> = { status };
    if (status === "terminé") update.date_fin = new Date().toISOString();
    const { error } = await supabase.from("maintenance_reports").update(update).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Statut mis à jour !"); fetchData(); }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "en_cours": return "bg-orange-100 text-orange-800";
      case "terminé": return "bg-green-100 text-green-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">Rapports de maintenance et réparations</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouveau rapport</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau rapport de maintenance</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Équipement</Label>
                <Select value={form.equipment_id} onValueChange={(v) => setForm({ ...form, equipment_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {equipments.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
              <Button onClick={handleAdd} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun rapport</TableCell></TableRow>
              ) : reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{(r.equipments as { name: string } | null)?.name || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.description}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>{new Date(r.date_debut).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    {r.status === "en_cours" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "terminé")}>Terminer</Button>
                    )}
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
