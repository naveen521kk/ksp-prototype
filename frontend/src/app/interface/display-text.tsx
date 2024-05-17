"use client";
import { getPresidioOutput } from "@/lib/api";
import { PresidioOutput } from "@/lib/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// a function to split the essay into parts
function findParts(textVal: string, suggestions: PresidioOutput[]) {
  // split the essay into parts, based on the suggestions
  // and mark the parts that are suggested
  let parts: {
    value: string;
    toUnderline: boolean;
    presidioObject?: PresidioOutput;
  }[] = [];
  let last = 0;
  console.log({ suggestions });
  suggestions.forEach((suggestion) => {
    const start = suggestion.start;
    const end = suggestion.end;
    parts.push({ value: textVal.slice(last, start), toUnderline: false });
    parts.push({
      value: textVal.slice(start, end),
      toUnderline: true,
      presidioObject: suggestion,
    });
    last = end;
  });
  parts.push({ value: textVal.slice(last), toUnderline: false });

  return parts;
}

// a function to process the suggestions and display them
function processSuggestions(essay: string, suggestions: PresidioOutput[]) {
  const parts = findParts(essay, suggestions);
  return (
    <>
      {parts.map((part, index) => {
        if (part.toUnderline) {
          return (
            <Popover key={index}>
              <PopoverTrigger>
                <span className="highlight">{part.value}</span>
              </PopoverTrigger>
              <PopoverContent>
                <div className="m-2">
                  <p>Entity Type: {part.presidioObject!.entity_type}</p>
                  <p>Prediction Score: {part.presidioObject!.score}</p>
                </div>
              </PopoverContent>
            </Popover>
          );
        }
        return <React.Fragment key={index}>{part.value}</React.Fragment>;
      })}
    </>
  );
}

export function DisplayEssay({
  textOps,
  setPresidioOps,
  presidioOps,
}: {
  textOps: string;
  setPresidioOps: React.Dispatch<React.SetStateAction<PresidioOutput[] | null>>;
  presidioOps: PresidioOutput[] | null;
}) {
  const [error, setError] = React.useState<string>("");
  React.useEffect(() => {
    // fetch the suggestion from the server
    const a = async () => {
      if (!textOps) return;
      try {
        const res = await getPresidioOutput(textOps);

        if (!res) return;

        // sort the suggestions based on the start index
        res.sort((a, b) => a.start - b.start);

        setPresidioOps(res);
      } catch (e: any) {
        console.error(e);
        setError("Failed to fetch suggestions");
        setPresidioOps([]);
      }
    };
    a();
  }, [textOps, setPresidioOps]);

  if (!textOps) return null;
  return (
    <>
      {error && <p>{error}</p>}
      <div className="flex h-full items-start justify-center p-8">
        <div className="text-2xl leading-10">
          <div className="editor" spellCheck="false">
            {processSuggestions(textOps, presidioOps || [])}
          </div>
        </div>
      </div>
    </>
  );
}
