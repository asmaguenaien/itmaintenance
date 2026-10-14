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

interface Reclamation {
  id: string;
  subject: string;
  description: string;
  status: string;
  response: string | null;
  created_at: string;
  equipments?: { name: string } | null;
}

export default function Reclamations() {
  const { user, role } = useAuth();
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [equipments, setEquipments] = useState<{ id: string; name: string }[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ equipment_id: "", subject: "", description: "" });
  const [respondId, setRespondId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const canRespond = role === "admin" || role === "technician";

  const fetchData = async () => {
    const [rRes, eRes] = await Promise.all([
      supabase.from("reclamations").select("*, equipments(name)").order("created_at", { ascending: false }),
      supabase.from("equipments").select("id, name"),
    ]);
    setReclamations(rRes.data || []);
    setEquipments(eRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.equipment_id || !form.subject || !form.description) { toast.error("Tous les champs requis"); return; }
    const { error } = await supabase.from("reclamations").insert({
      equipment_id: form.equipment_id,
      user_id: user!.id,
      subject: form.subject,
      description: form.description,
    });
    if (error) toast.error(error.message);
    else { toast.success("Réclamation envoyée !"); setAddOpen(false); setForm({ equipment_id: "", subject: "", description: "" }); fetchData(); }
  };

  const handleRespond = async () => {
    if (!respondId || !responseText) return;
    const { error } = await supabase.from("reclamations").update({ response: responseText, status: "traitée" }).eq("id", respondId);
    if (error) toast.error(error.message);
    else { toast.success("Réponse envoyée !"); setRespondId(null); setResponseText(""); fetchData(); }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "en_attente": return "bg-yellow-100 text-yellow-800";
      case "traitée": return "bg-green-100 text-green-800";
      case "rejetée": return "bg-red-100 text-red-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réclamations</h1>
          <p className="text-muted-foreground">Suivez vos réclamations</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouvelle réclamation</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle réclamation</DialogTitle></DialogHeader>
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
              <div className="space-y-2"><Label>Sujet</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
              <Button onClick={handleAdd} className="w-full">Envoyer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sujet</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Réponse</TableHead>
                {canRespond && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reclamations.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune réclamation</TableCell></TableRow>
              ) : reclamations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell>{(r.equipments as { name: string } | null)?.name || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="max-w-xs truncate">{r.response || "—"}</TableCell>
                  {canRespond && (
                    <TableCell>
                      {r.status === "en_attente" && (
                        <Dialog open={respondId === r.id} onOpenChange={(open) => { if (!open) setRespondId(null); else setRespondId(r.id); }}>
                          <DialogTrigger asChild><Button size="sm" variant="outline">Répondre</Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Répondre à : {r.subject}</DialogTitle></DialogHeader>
                            <p className="text-sm text-muted-foreground">{r.description}</p>
                            <Textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Votre réponse..." rows={4} />
                            <Button onClick={handleRespond}>Envoyer la réponse</Button>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
