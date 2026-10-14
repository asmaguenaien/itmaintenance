import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Eye } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
}

export default function Equipements() {
  const { user, role } = useAuth();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [detailEquipment, setDetailEquipment] = useState<Equipment | null>(null);
  const [form, setForm] = useState({ name: "", type: "", brand: "", model: "", serial_number: "" });

  const canManage = role === "admin" || role === "technician";

  const fetchEquipments = async () => {
    const { data } = await supabase.from("equipments").select("*").order("created_at", { ascending: false });
    setEquipments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEquipments(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.type) { toast.error("Nom et type requis"); return; }
    const { error } = await supabase.from("equipments").insert({
      ...form,
      added_by: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Équipement ajouté !"); setAddOpen(false); setForm({ name: "", type: "", brand: "", model: "", serial_number: "" }); fetchEquipments(); }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "disponible": return "bg-green-100 text-green-800";
      case "en_maintenance": return "bg-orange-100 text-orange-800";
      case "affecté": return "bg-blue-100 text-blue-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipements</h1>
          <p className="text-muted-foreground">Gestion du parc matériel</p>
        </div>
        {canManage && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvel Équipement</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nom *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordinateur">Ordinateur</SelectItem>
                      <SelectItem value="imprimante">Imprimante</SelectItem>
                      <SelectItem value="serveur">Serveur</SelectItem>
                      <SelectItem value="réseau">Réseau</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Marque</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Modèle</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>N° Série</Label><Input value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} /></div>
                <Button onClick={handleAdd} className="w-full">Ajouter</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chargement...</TableCell></TableRow>
              ) : equipments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun équipement</TableCell></TableRow>
              ) : equipments.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell className="capitalize">{eq.type}</TableCell>
                  <TableCell>{eq.brand || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(eq.status)}>{eq.status}</Badge></TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>{eq.name}</DialogTitle></DialogHeader>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-muted-foreground">Type :</span> <span className="capitalize">{eq.type}</span></div>
                          <div><span className="text-muted-foreground">Marque :</span> {eq.brand || "—"}</div>
                          <div><span className="text-muted-foreground">Modèle :</span> {eq.model || "—"}</div>
                          <div><span className="text-muted-foreground">N° Série :</span> {eq.serial_number || "—"}</div>
                          <div><span className="text-muted-foreground">Statut :</span> <Badge variant="secondary" className={statusColor(eq.status)}>{eq.status}</Badge></div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
