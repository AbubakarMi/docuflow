import { Feather } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Feather className="h-5 w-5 text-primary" />
      </div>
      <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
        InvoTrek
      </h1>
    </div>
  );
}
