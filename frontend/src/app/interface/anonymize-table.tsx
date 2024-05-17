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
import { PresidioOutput } from "@/lib/types";

export function AnonymizeTable({
  presidioOps,
}: {
  presidioOps: PresidioOutput[] | null;
}) {
  return (
    <>
      <h2 className="text-xl font-bold tracking-tight">Items</h2>
      <Table>
        <TableCaption>The things that are anonymized.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Entity Type</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presidioOps?.map((presidioOp, index) => (
            <TableRow key={index}>
              <TableCell>
                <Label>{presidioOp.entity_type}</Label>
              </TableCell>
              <TableCell>{presidioOp.text}</TableCell>
              <TableCell>
                <Input type="number" value={presidioOp.score} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
