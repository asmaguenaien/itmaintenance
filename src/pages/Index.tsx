import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Wrench, PackageSearch, Shield, ArrowRight } from "lucide-react";

export default function Index() {
  const { user } = useAuth();

  const services = [
    {
      icon: Monitor,
      title: "Équipements",
      description: "Gérez votre parc matériel : ajout, mise à jour et suivi des équipements informatiques.",
    },
    {
      icon: PackageSearch,
      title: "Inventaire",
      description: "Suivez vos articles et stocks en temps réel avec une vue complète de votre parc.",
    },
    {
      icon: Wrench,
      title: "Maintenance",
      description: "Créez des rapports de maintenance et suivez les réparations en cours.",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">IT</span>Maintenance
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild><Link to="/dashboard">Tableau de bord <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Connexion</Link></Button>
                <Button asChild><Link to="/register">S'inscrire</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Gestion de parc informatique <span className="text-primary">simplifiée</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Une application web complète pour gérer vos équipements, suivre les maintenances
            et traiter les réclamations de votre parc informatique.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/register"}>
                Commencer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card key={service.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold"><span className="text-primary">IT</span>Maintenance</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 ITMaintenance. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
