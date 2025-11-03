import { ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const HelpDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          title="Ajuda"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card z-[100]">
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
          Educação
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          <span>Blogs</span>
          <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <span>Vídeos</span>
          <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
          Suporte
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          <span>Página de status</span>
          <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <span>Central de ajuda</span>
          <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <span>Atualizações</span>
          <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpDropdown;
