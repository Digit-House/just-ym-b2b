import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import ModalWrapper from "@/components/ModalWrapper";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries } from "@/hooks/useCountries";
import { seedProductByCountry } from "@/graphql/product";

interface Props {
  onOpenChange: (open: boolean) => void;
  /** Called after a successful seed so the caller can refetch its list. */
  onSeeded: () => void;
}

const SeedTicketsDialog = ({ onOpenChange, onSeeded }: Props) => {
  const { data, isLoading } = useCountries({
    limit: 250,
    page: 1,
    orderBy: { dir: "asc" },
    isPublished: null,
    search: null,
  });
  // Seed needs the supplier country id; countries without one cannot be seeded.
  const countries = useMemo(
    () => (data?.data ?? []).filter((c) => c.globaltixId != null),
    [data],
  );

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const selected = countries.find((c) => c.id === selectedId);

  const handleSeed = async () => {
    if (!selected?.globaltixId) return;
    setConfirmOpen(false);
    setRunning(true);
    setResult(null);
    try {
      const res = await seedProductByCountry(selected.globaltixId);
      setResult({ ok: true, message: `${selected.name}: ${res.message}` });
      onSeeded();
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Failed to seed tickets",
      });
    } finally {
      setRunning(false);
    }
  };

  // A running seed cannot be cancelled, so keep the dialog open until it ends.
  const handleClose = () => {
    if (!running) onOpenChange(false);
  };

  return (
    <>
      <ModalWrapper title="Seed Tickets" onClose={handleClose}>
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Import tickets for a country from the supplier.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Country</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={isLoading || running}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                >
                  <span className={selected ? "" : "text-gray-400"}>
                    {isLoading
                      ? "Loading countries..."
                      : (selected?.name ?? "Select a country")}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No countries found</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.name} ${c.code}`}
                          onSelect={() => {
                            setSelectedId(c.id);
                            setResult(null);
                            setOpen(false);
                          }}
                        >
                          {c.name}
                          {c.id === selectedId && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {running && (
            <p className="text-sm text-gray-500">
              Seeding tickets from the supplier. This can take a while, keep
              this dialog open...
            </p>
          )}
          {result && (
            <p
              className={`text-sm ${result.ok ? "text-emerald-600" : "text-red-500"}`}
            >
              {result.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={running}>
              Close
            </Button>
            <Button
              loading={running}
              disabled={!selected || running}
              onClick={() => setConfirmOpen(true)}
            >
              Seed tickets
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {confirmOpen && selected && (
        <ModalWrapper title="Seed tickets?" onClose={() => setConfirmOpen(false)}>
          <p className="text-sm text-gray-600">
            This syncs all tickets for <b>{selected.name}</b> from the supplier.
            It may take a long time and cannot be cancelled once started.
          </p>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSeed}>Seed tickets</Button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export default SeedTicketsDialog;
