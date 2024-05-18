"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnonymizeTable } from "./anonymize-table";
import React from "react";
import { DisplayEssay } from "./display-text";
import { ModelOutput, PresidioOutput } from "@/lib/types";
import { anonymizeText } from "@/lib/api";
import { useAtom } from "jotai";
import { presidioOpsAtom } from "@/lib/atoms";

export default function MainInterface() {
  const [textOps, setTextOps] = React.useState<string>("");
  const [modelOutput, setModelOutput] = React.useState<ModelOutput | null>(
    null,
  );
  const [error, setError] = React.useState<string>("");
  const requestCount = React.useRef(0);

  React.useEffect(() => {
    // fetch the suggestion from the server
    const a = async () => {
      if (!textOps) return;
      if (requestCount.current > 0) return;
      try {
        const res = await anonymizeText(textOps);

        if (!res) return;

        setModelOutput(res);
        requestCount.current += 1;
      } catch (e: any) {
        console.error(e);
        setError("Failed to fetch suggestions");
        setModelOutput(null);
      }
    };
    a();
  }, [textOps]);

  React.useEffect(() => {
    // get textOps from localStorage
    const textOps = localStorage.getItem("textOps");
    if (textOps) {
      setTextOps(textOps);
    }
  }, []);

  if (!textOps) {
    return <></>;
  }

  return (
    <main>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[100vh] rounded-lg border"
      >
        <ResizablePanel defaultSize={60} order={1}>
          <ScrollArea className="h-[100vh] w-full">
            {error && <p>{error}</p>}
            <DisplayEssay textOps={textOps} modelOutput={modelOutput} />
          </ScrollArea>
          {/* <div className="flex h-full items-start justify-center p-14">
            <div className="text-2xl leading-10">
              <div className="editor" spellCheck="false">
                {s1 === 0 && (
                  <>
                    <p>
                      The text in the image is a police report from the Amengad
                      Police Station in Bagalkot, Karnataka, India. The report
                      is dated 10-11-2022 and is about a man named{" "}
                      <span className="highlight">{name}</span>. The report
                      states that <span className="highlight">{name}</span> is a
                      &quot;rowdy&quot; and a &quot;habitual offender&quot; who
                      &quot;disturbs public peace in public places.&quot; The
                      report also states that{" "}
                      <span className="highlight">{name}</span> is &quot;under
                      surveillance.&quot;
                    </p>

                    <p>
                      The report is signed by a police officer named SOMAPPA.
                      The report is also stamped with the seal of the Amengad
                      Police Station.
                    </p>

                    <p>Police Report Police Station:</p>
                    <p>Amengad PS Case Number: 2022000003</p>
                    <p>Date: 10-11-2022</p>
                    <p>
                      Subject: <span className="highlight">{name}</span>{" "}
                    </p>
                    <p>
                      Details: The accused is a rowdy and a habitual offender.
                      He disturbs public peace in public places. He is under
                      surveillance.{" "}
                    </p>
                    <p>
                      Action Taken: The accused has been warned. He has been
                      told to stop disturbing public peace.{" "}
                    </p>
                    <p>Signature: SOMAPPA Police </p>
                    <p>Officer Seal: Amengad Police Station</p>
                  </>
                )}
                {s1 === 1 && (
                  <>
                    <p>
                      The text in the image is a police report from the Amengad
                      Police Station in Bagalkot, Karnataka, India. The report
                      is dated 10-11-2022 and is about a man named{" "}
                      <span className="highlight">Aadesh Muni</span>. The report
                      states that <span className="highlight">Aadesh Muni</span>{" "}
                      is a &quot;rowdy&quot; and a &quot;habitual offender&quot;
                      who &quot;disturbs public peace in public places.&quot;
                      The report also states that{" "}
                      <span className="highlight">Aadesh Muni</span> is
                      &quot;under surveillance.&quot;
                    </p>

                    <p>
                      The report is signed by a police officer named SOMAPPA.
                      The report is also stamped with the seal of the Amengad
                      Police Station.
                    </p>

                    <p>Police Report Police Station:</p>
                    <p>Amengad PS Case Number: 2022000003</p>
                    <p>Date: 10-11-2022</p>
                    <p>
                      Subject: <span className="highlight">Aadesh Muni</span>{" "}
                    </p>
                    <p>
                      Details: The accused is a rowdy and a habitual offender.
                      He disturbs public peace in public places. He is under
                      surveillance.{" "}
                    </p>
                    <p>
                      Action Taken: The accused has been warned. He has been
                      told to stop disturbing public peace.{" "}
                    </p>
                    <p>Signature: SOMAPPA Police </p>
                    <p>Officer Seal: Amengad Police Station</p>
                  </>
                )}
              </div>
            </div>
          </div> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={40} order={2}>
          <ScrollArea className="h-[100vh] w-full">
            <div className="flex h-full w-full flex-col items-center justify-normal space-y-4 p-6">
              <div className="w-full space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow">
                <div className="w-full ">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Anonymize
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      The things that are anonymized.
                    </p>
                  </div>
                </div>
                <Separator />
                <AnonymizeTable
                  modelOutput={modelOutput}
                  setTextOps={setTextOps}
                />
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
