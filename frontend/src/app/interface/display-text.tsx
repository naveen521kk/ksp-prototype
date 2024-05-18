"use client";
import { getPresidioOutput } from "@/lib/api";
import { Mask, ModelOutput, PresidioOutput } from "@/lib/types";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAtom } from "jotai";
import { presidioOpsAtom } from "@/lib/atoms";

// a function to split the essay into parts
function findParts(
  textVal: string,
  suggestions: PresidioOutput[],
  modelOutput: ModelOutput | null,
) {
  if (!modelOutput) return [{ value: textVal, toUnderline: false }];
  // split the essay into parts, based on the suggestions
  // and mark the parts that are suggested
  let parts: {
    value: string;
    toUnderline: boolean;
    presidioObject?: PresidioOutput;
    maskItem?: Mask;
  }[] = [];
  let last = 0;
  suggestions.forEach((suggestion, index) => {
    const start = suggestion.start;
    const end = suggestion.end;
    parts.push({ value: textVal.slice(last, start), toUnderline: false });
    parts.push({
      value: textVal.slice(start, end),
      toUnderline: true,
      presidioObject: suggestion,
      maskItem: modelOutput.mask_list[index],
    });
    last = end;
  });
  parts.push({ value: textVal.slice(last), toUnderline: false });

  return parts;
}

// a function to process the suggestions and display them
function processSuggestions(
  essay: string,
  suggestions: PresidioOutput[],
  modelOutput: ModelOutput | null,
) {
  const parts = findParts(essay, suggestions, modelOutput);

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
                  {part.maskItem && (
                    <div>
                      <p>Original Text: {part.maskItem.original_text}</p>
                      <p>Options:</p>
                      <ul className="list-disc pl-5">
                        {part.maskItem.options.map((option, index) => (
                          <li key={index}>{option.token_str}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
  modelOutput,
}: {
  textOps: string;
  modelOutput: ModelOutput | null;
}) {
  const [error, setError] = React.useState<string>("");
  const [presidioOps, setPresidioOps] = useAtom(presidioOpsAtom);
  const requestCount = React.useRef(0);
  React.useEffect(() => {
    // fetch the suggestion from the server
    const a = async () => {
      if (!textOps) return;
      if (requestCount.current > 0) return;
      try {
        const res = await getPresidioOutput(textOps);

        if (!res) return;

        // sort the suggestions based on the start index
        res.sort((a, b) => a.start - b.start);

        setPresidioOps((_) => res);
        requestCount.current += 1;
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
            {processSuggestions(textOps, presidioOps || [], modelOutput)}
          </div>
        </div>
      </div>
    </>
  );
}
