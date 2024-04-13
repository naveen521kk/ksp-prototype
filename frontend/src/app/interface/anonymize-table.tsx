import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function AnonymizeTable({
  setS1,
}: {
  setS1: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      <h2 className="text-xl font-bold tracking-tight">Items</h2>
      <Table>
        <TableCaption>Select items you want to anonymized</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25px]"></TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Original</TableHead>
            <TableHead>Replacement</TableHead>
            <TableHead className="w-[25px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox id="terms" />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>NAGAN MUNNI</TableCell>
            <TableCell>Ramasawamy</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} size="sm">
                    <Pencil1Icon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Update Replacement
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Edit the content of the selected item
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Replacement</Label>
                        <Input
                          id="width"
                          defaultValue="Ramasawamy"
                          className="col-span-2 h-8"
                          autoFocus
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setS1(1);
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
