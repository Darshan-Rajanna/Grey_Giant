import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-black border border-white/10">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-serif font-bold text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-white/60 mb-6">
            The page you are looking for does not exist or has been moved.
          </p>

          <Button asChild className="w-full bg-white text-black hover:bg-white/90 rounded-none">
            <Link href={import.meta.env.BASE_URL}>Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
