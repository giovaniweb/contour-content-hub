
import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScriptResponse } from "@/types/script"
import { Button } from "@/components/ui/button"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({
  className,
  ...props
}: SheetPrimitive.DialogPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props} />
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

// Componente ScriptValidation que será exportado
interface ScriptValidationProps {
  script: ScriptResponse;
  onValidationComplete: () => void;
}

interface ValidationResult {
  blocos?: Array<{
    tipo: string;
    nota: number;
    texto: string;
    sugestao: string;
  }>;
  nota_geral?: number;
  total?: number;
  sugestoes?: string;
  sugestoes_gerais?: string[];
}

const ScriptValidation: React.FC<ScriptValidationProps> = ({ script, onValidationComplete }) => {
  const [loading, setLoading] = React.useState(true);
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const validateScript = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Validando script:", script.id);
        
        // Simular uma chamada à API de validação
        const response = await new Promise<ValidationResult>((resolve) => {
          setTimeout(() => {
            resolve({
              blocos: [
                {
                  tipo: "gancho",
                  nota: 7.5,
                  texto: script.content.substring(0, 100),
                  sugestao: "Considere adicionar uma estatística ou pergunta retórica para aumentar o impacto inicial."
                },
                {
                  tipo: "desenvolvimento",
                  nota: 8.0,
                  texto: script.content.substring(100, 200),
                  sugestao: "Está bom, mas poderia detalhar mais os benefícios específicos."
                },
                {
                  tipo: "cta",
                  nota: 6.5,
                  texto: script.content.substring(script.content.length - 100),
                  sugestao: "Adicione uma sensação de urgência ou exclusividade no CTA."
                }
              ],
              nota_geral: 7.3,
              total: 7.3,
              sugestoes: "Melhor o gancho inicial e fortaleça o CTA final.",
              sugestoes_gerais: [
                "Melhor o gancho inicial com uma estatística ou pergunta retórica.",
                "Detalhe mais os benefícios específicos do tratamento.",
                "Adicione uma sensação de urgência ou exclusividade no CTA."
              ]
            });
          }, 1500);
        });
        
        setValidationResult(response);
        onValidationComplete();
      } catch (err) {
        console.error("Erro ao validar script:", err);
        setError("Ocorreu um erro ao validar o script. Por favor tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    validateScript();
  }, [script, onValidationComplete]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p>Validando seu roteiro...</p>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded animate-pulse"></div>
          <div className="h-2 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-2 bg-muted rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Pontuação geral</h3>
        <div className="flex items-center space-x-1">
          <span className="text-lg font-semibold">
            {validationResult.nota_geral?.toFixed(1) || "0.0"}
          </span>
          <span className="text-muted-foreground">/10</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {validationResult.blocos?.map((bloco, index) => (
          <div key={index} className="border rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium capitalize">{bloco.tipo}</h4>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                {bloco.nota.toFixed(1)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{bloco.texto}...</p>
            <div className="bg-muted p-2 rounded-md text-sm">
              <p className="font-medium">Sugestão:</p>
              <p>{bloco.sugestao}</p>
            </div>
          </div>
        ))}
      </div>
      
      {validationResult.sugestoes_gerais && validationResult.sugestoes_gerais.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Sugestões para melhorar</h3>
          <ul className="space-y-2">
            {validationResult.sugestoes_gerais.map((sugestao, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 min-w-4 h-1 w-1 rounded-full bg-primary"></div>
                <p className="text-sm">{sugestao}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { ScriptValidation };

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
