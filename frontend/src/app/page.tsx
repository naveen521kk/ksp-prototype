"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = React.useState<File | null>(null);
  const [reqLoading, setReqLoading] = React.useState(false);

  return (
    <main className="container my-5 flex min-h-screen flex-col items-center justify-center space-y-4 lg:my-0">
      <div className="space-y-2">
        {/* <Label htmlFor="essay" className="font-semibold text-2xl text-center">
          Essay Validator
        </Label> */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Upload your document
          </h1>
          <p className="text-gray-500 dark:text-gray-400">To get started!</p>
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Input
          id="file"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
          disabled={reqLoading}
        />
        <Button
          variant="outline"
          onClick={async (e) => {
            e.preventDefault();
            if (file) {
              try {
                setReqLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/parse_doc`,
                  {
                    method: "POST",
                    body: formData,
                  },
                );
                const res = await response.text();

                const c = JSON.parse(res);

                localStorage.setItem("textOps", c);
                router.push("/interface");
              } catch (e: any) {
                console.error(e);
                toast.error("Failed to upload file. Please try again.");
              }
            } else {
              toast.error("Please select a file to upload.");
            }
            setReqLoading(false);
          }}
          disabled={reqLoading}
        >
          {reqLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload File
        </Button>
      </div>
    </main>
  );
}
