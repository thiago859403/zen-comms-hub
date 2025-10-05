import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportCSVDialogProps {
  onContactsImported: (contacts: any[]) => void;
}

export function ImportCSVDialog({ onContactsImported }: ImportCSVDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const contacts = lines.slice(1).filter(line => line.trim()).map((line, index) => {
        const values = line.split(",").map(v => v.trim());
        return {
          id: Date.now() + index,
          name: values[0] || "",
          phone: values[1] || "",
          email: values[2] || "",
          tags: values[3] ? values[3].split(";").filter(t => t) : [],
          lastContact: "Importado agora",
        };
      });

      onContactsImported(contacts);
      
      toast({
        title: "Sucesso",
        description: `${contacts.length} contatos importados com sucesso`,
      });

      setOpen(false);
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar Contatos via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV com as colunas: Nome, Telefone, Email, Tags (separadas por ;)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Formato esperado:</p>
            <code className="block bg-muted p-2 rounded text-xs">
              Nome,Telefone,Email,Tags<br />
              João Silva,+55 11 99999-1111,joao@email.com,Cliente;VIP
            </code>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
