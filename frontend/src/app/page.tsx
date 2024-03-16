import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center container space-y-4 my-5 lg:my-0">
      <div className="w-full">
        <Label htmlFor="essay" className="font-semibold text-lg text-center">
          Enter essay below:
        </Label>
        <Textarea id="essay" className="min-h-[70vh]" />
      </div>
      <div className="w-full flex flex-row space-x-3">
        <Button className="w-full">Submit</Button>
        <Button className="w-full" variant="outline">
          Upload File
        </Button>
      </div>
    </main>
  );
}
