import { Button } from "@/components/ui/button";
export default function Home() {
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
      <div className="flex flex-row space-x-3">
        <Button variant="outline">Upload File</Button>
      </div>
    </main>
  );
}
