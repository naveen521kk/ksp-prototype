"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ModelOutput, PresidioOutput } from "@/lib/types";
import { useAtom } from "jotai";
import { presidioOpsAtom } from "@/lib/atoms";

function TableItemRow({
  presidioOp,
  modelOutput,
  index,
  setTextOps,
}: {
  presidioOp: PresidioOutput;
  modelOutput: ModelOutput | null;
  index: number;
  setTextOps: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [replacement, setReplacement] = React.useState<string>("");
  const [presidioOps, setPresidioOps] = useAtom(presidioOpsAtom);
  return (
    <>
      <TableRow>
        <TableCell>
          <Label>{presidioOp.entity_type}</Label>
        </TableCell>
        <TableCell>{presidioOp.text}</TableCell>
        <TableCell>
          <Label>{presidioOp.score}</Label>
        </TableCell>
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
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Select
                      onValueChange={(value) => {
                        setReplacement(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Replacement" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOutput?.mask_list[index].options.map(
                          (option, index) => (
                            <SelectItem key={index} value={option.token_str}>
                              {option.token_str}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Replacement</Label>
                      <Input
                        id="width"
                        defaultValue="Ramasawamy"
                        className="col-span-2 h-8"
                        autoFocus
                        value={replacement}
                        onChange={(e) => setReplacement(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();

                    // change the textOps
                    setTextOps((textOps) => {
                      // get the start and end index
                      const start = presidioOp.start;
                      const end = presidioOp.end;

                      // replace the text
                      const newTextOps =
                        textOps.slice(0, start) +
                        replacement +
                        textOps.slice(end);

                      return newTextOps;
                    });

                    // update the presidioOps
                    setPresidioOps((presidioOps) => {
                      // take a very deep copy of the presidioOps
                      const newPresidioOps = JSON.parse(
                        JSON.stringify(presidioOps),
                      );

                      newPresidioOps[index]["end"] =
                        presidioOp.start + replacement.length;
                      // update the start and end of items following the current item
                      let offset = replacement.length - presidioOp.text.length;
                      for (let i = index + 1; i < newPresidioOps.length; i++) {
                        newPresidioOps[i]["start"] += offset;
                        newPresidioOps[i]["end"] += offset;
                      }
                      newPresidioOps[index]["text"] = replacement;

                      console.log({ presidioOps, newPresidioOps });
                      return newPresidioOps;
                    });
                  }}
                >
                  Submit
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </>
  );
}

export function AnonymizeTable({
  modelOutput,
  setTextOps,
}: {
  modelOutput: ModelOutput | null;
  setTextOps: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [presidioOps, setPresidioOps] = useAtom(presidioOpsAtom);
  console.log({ presidioOps });
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
            <TableHead className="w-[25px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presidioOps?.map((presidioOp, index) => (
            <TableItemRow
              key={index}
              presidioOp={presidioOp}
              modelOutput={modelOutput}
              index={index}
              setTextOps={setTextOps}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
