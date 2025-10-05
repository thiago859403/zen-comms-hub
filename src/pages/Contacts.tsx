import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Download,
  MoreVertical,
  UserPlus,
  Trash2,
  Edit,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddContactDialog } from "@/components/contacts/AddContactDialog";
import { EditContactDialog } from "@/components/contacts/EditContactDialog";
import { ImportCSVDialog } from "@/components/contacts/ImportCSVDialog";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastContact: string;
}

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Ana Silva",
      phone: "+55 11 99999-1234",
      email: "ana@email.com",
      tags: ["Cliente", "VIP"],
      lastContact: "2 dias atrás",
    },
    {
      id: 2,
      name: "Bruno Santos",
      phone: "+55 11 99999-5678",
      email: "bruno@email.com",
      tags: ["Lead"],
      lastContact: "1 semana atrás",
    },
    {
      id: 3,
      name: "Carla Oliveira",
      phone: "+55 11 99999-9012",
      email: "carla@email.com",
      tags: ["Cliente"],
      lastContact: "3 dias atrás",
    },
    {
      id: 4,
      name: "Daniel Costa",
      phone: "+55 11 99999-3456",
      email: "daniel@email.com",
      tags: ["Lead", "Interessado"],
      lastContact: "1 dia atrás",
    },
  ]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const handleSelectContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [...prev, newContact]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
  };

  const handleDeleteContact = () => {
    if (contactToDelete) {
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      toast({
        title: "Sucesso",
        description: "Contato excluído com sucesso",
      });
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const handleImportContacts = (importedContacts: Contact[]) => {
    setContacts((prev) => [...prev, ...importedContacts]);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Nome", "Telefone", "Email", "Tags"],
      ...filteredContacts.map((c) => [
        c.name,
        c.phone,
        c.email,
        c.tags.join(";"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contatos.csv";
    a.click();
    
    toast({
      title: "Sucesso",
      description: "Contatos exportados com sucesso",
    });
  };

  const handleAddToCampaign = (contactId: number) => {
    toast({
      title: "Em desenvolvimento",
      description: "Esta funcionalidade será implementada em breve",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Contatos</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie sua lista de contatos
            </p>
          </div>
          <div className="flex gap-2">
            <ImportCSVDialog onContactsImported={handleImportContacts} />
            <AddContactDialog onContactAdded={handleAddContact} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total de Contatos</p>
            <p className="text-2xl font-bold mt-1">{contacts.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Selecionados</p>
            <p className="text-2xl font-bold mt-1">{selectedContacts.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Clientes</p>
            <p className="text-2xl font-bold mt-1">
              {contacts.filter((c) => c.tags.includes("Cliente")).length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Leads</p>
            <p className="text-2xl font-bold mt-1">
              {contacts.filter((c) => c.tags.includes("Lead")).length}
            </p>
          </Card>
        </div>

        {/* Search and filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            {selectedContacts.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedContacts([]);
                  toast({
                    title: "Seleção limpa",
                    description: "Todos os contatos foram desmarcados",
                  });
                }}
              >
                Limpar seleção ({selectedContacts.length})
              </Button>
            )}
          </div>
        </Card>

        {/* Contacts table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredContacts.length > 0 &&
                      selectedContacts.length === filteredContacts.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Último Contato</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => handleSelectContact(contact.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {contact.lastContact}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingContact(contact);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddToCampaign(contact.id)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Adicionar a campanha
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setContactToDelete(contact.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <EditContactDialog
          contact={editingContact}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onContactUpdated={handleUpdateContact}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteContact}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Contacts;