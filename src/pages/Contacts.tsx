import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Download,
  MoreVertical,
  UserPlus,
  Trash2,
  Edit,
  Filter,
  X,
  List,
  Grid3x3,
  Tag,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Send,
  Bot,
  ChevronDown,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import { AddContactDialog } from "@/components/contacts/AddContactDialog";
import { EditContactDialog } from "@/components/contacts/EditContactDialog";
import { ImportCSVDialog } from "@/components/contacts/ImportCSVDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastContact: string;
  status?: "Cliente" | "Lead";
}

type ViewMode = "list" | "grid";

const Contacts = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Ana Silva",
      phone: "+55 11 99999-1234",
      email: "ana@email.com",
      tags: ["Cliente", "VIP"],
      lastContact: "2 dias atrás",
      status: "Cliente",
    },
    {
      id: 2,
      name: "Bruno Santos",
      phone: "+55 11 99999-5678",
      email: "bruno@email.com",
      tags: ["Lead"],
      lastContact: "1 semana atrás",
      status: "Lead",
    },
    {
      id: 3,
      name: "Carla Oliveira",
      phone: "+55 11 99999-9012",
      email: "carla@email.com",
      tags: ["Cliente"],
      lastContact: "3 dias atrás",
      status: "Cliente",
    },
    {
      id: 4,
      name: "Daniel Costa",
      phone: "+55 11 99999-3456",
      email: "daniel@email.com",
      tags: ["Lead", "Interessado"],
      lastContact: "1 dia atrás",
      status: "Lead",
    },
  ]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [lastContactFilter, setLastContactFilter] = useState<string>("all");
  const { toast } = useToast();

  // Obter todas as tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [contacts]);

  // Filtrar contatos
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Busca
      const matchesSearch =
        !searchQuery ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => contact.tags.includes(tag));

      // Status
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "Cliente" && contact.status === "Cliente") ||
        (selectedStatus === "Lead" && contact.status === "Lead");

      return matchesSearch && matchesTags && matchesStatus;
    });
  }, [contacts, searchQuery, selectedTags, selectedStatus]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = contacts.length;
    const clientes = contacts.filter((c) => c.status === "Cliente").length;
    const leads = contacts.filter((c) => c.status === "Lead").length;
    const vip = contacts.filter((c) => c.tags.includes("VIP")).length;
    const selected = selectedContacts.length;
    return { total, clientes, leads, vip, selected };
  }, [contacts, selectedContacts]);

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
      setSelectedContacts((prev) => prev.filter((id) => id !== contactToDelete));
    }
  };

  const handleBulkDelete = () => {
    setContacts((prev) => prev.filter((c) => !selectedContacts.includes(c.id)));
    toast({
      title: "Sucesso",
      description: `${selectedContacts.length} contato(s) excluído(s) com sucesso`,
    });
    setSelectedContacts([]);
  };

  const handleImportContacts = (importedContacts: Contact[]) => {
    setContacts((prev) => [...prev, ...importedContacts]);
  };

  const handleExportCSV = (selectedOnly = false) => {
    const toExport = selectedOnly
      ? contacts.filter((c) => selectedContacts.includes(c.id))
      : filteredContacts;

    if (toExport.length === 0) {
      toast({
        title: "Nenhum contato para exportar",
        description: "Selecione contatos ou ajuste os filtros",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ["Nome", "Telefone", "Email", "Tags", "Status"],
      ...toExport.map((c) => [
        c.name,
        c.phone,
        c.email,
        c.tags.join(";"),
        c.status || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contatos_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Sucesso",
      description: `${toExport.length} contato(s) exportado(s) com sucesso`,
    });
  };

  const handleAddToCampaign = (contactId?: number) => {
    const ids = contactId ? [contactId] : selectedContacts;
    toast({
      title: "Adicionar à campanha",
      description: `${ids.length} contato(s) será(ão) adicionado(s) à campanha`,
    });
  };

  const handleAddToChatbot = (contactId?: number) => {
    const ids = contactId ? [contactId] : selectedContacts;
    toast({
      title: "Integrar com chatbot",
      description: `${ids.length} contato(s) será(ão) integrado(s) com o chatbot`,
    });
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedStatus("all");
    setLastContactFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedTags.length > 0 || selectedStatus !== "all" || lastContactFilter !== "all";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Contatos</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie sua base de contatos com inteligência e segmentação
            </p>
          </div>
          <div className="flex gap-2">
            <ImportCSVDialog onContactsImported={handleImportContacts} />
            <AddContactDialog onContactAdded={handleAddContact} />
          </div>
        </div>

        {/* Estatísticas Melhoradas */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-3xl font-bold mt-1">{stats.clientes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/20" />
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-3xl font-bold mt-1">{stats.leads}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-500/20" />
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VIP</p>
                <p className="text-3xl font-bold mt-1">{stats.vip}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-500/20" />
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selecionados</p>
                <p className="text-3xl font-bold mt-1">{stats.selected}</p>
              </div>
              <Checkbox className="h-8 w-8 text-orange-500/20" />
            </div>
          </Card>
        </div>

        {/* Barra de Busca e Ações */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca Inteligente */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filtros e Visualização */}
            <div className="flex gap-2">
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtros
                    {hasActiveFilters && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {selectedTags.length + (selectedStatus !== "all" ? 1 : 0) + (lastContactFilter !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Filtros Avançados</h4>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 text-xs"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                    <Separator />
                    
                    {/* Filtro por Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Cliente">Clientes</SelectItem>
                          <SelectItem value="Lead">Leads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filtro por Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <ScrollArea className="h-32">
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleTagFilter(tag)}
                            >
                              {tag}
                              {selectedTags.includes(tag) && (
                                <X className="ml-1 h-3 w-3" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Filtro por Último Contato */}
                    <div className="space-y-2">
                      <Label>Último Contato</Label>
                      <Select value={lastContactFilter} onValueChange={setLastContactFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="today">Hoje</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Toggle Visualização */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Exportar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExportCSV(false)}>
                    Exportar todos ({filteredContacts.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportCSV(true)}
                    disabled={selectedContacts.length === 0}
                  >
                    Exportar selecionados ({selectedContacts.length})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tags Selecionadas */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTagFilter(tag)}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                Limpar todos
              </Button>
            </div>
          )}

          {/* Ações em Massa */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm font-medium">
                {selectedContacts.length} contato(s) selecionado(s)
              </span>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToCampaign()}
              >
                <Send className="mr-2 h-4 w-4" />
                Adicionar à Campanha
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToChatbot()}
              >
                <Bot className="mr-2 h-4 w-4" />
                Integrar Chatbot
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportCSV(true)}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedContacts([])}
              >
                Limpar seleção
              </Button>
            </div>
          )}
        </Card>

        {/* Resultados */}
        {filteredContacts.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum contato encontrado</h3>
            <p className="text-muted-foreground">
              {hasActiveFilters || searchQuery
                ? "Tente ajustar os filtros ou a busca"
                : "Comece adicionando seu primeiro contato"}
            </p>
          </Card>
        ) : viewMode === "list" ? (
          /* Visualização em Lista */
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
                  <TableHead>Contato</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={contact.status === "Cliente" ? "default" : "outline"}
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {contact.lastContact}
                      </div>
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
                            <Send className="mr-2 h-4 w-4" />
                            Adicionar à Campanha
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddToChatbot(contact.id)}
                          >
                            <Bot className="mr-2 h-4 w-4" />
                            Integrar Chatbot
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
        ) : (
          /* Visualização em Cards */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => handleSelectContact(contact.id)}
                      />
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge
                          variant={contact.status === "Cliente" ? "default" : "outline"}
                          className="mt-1"
                        >
                          {contact.status}
                        </Badge>
                      </div>
                    </div>
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
                          <Send className="mr-2 h-4 w-4" />
                          Adicionar à Campanha
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddToChatbot(contact.id)}
                        >
                          <Bot className="mr-2 h-4 w-4" />
                          Integrar Chatbot
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{contact.lastContact}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
