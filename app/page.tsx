import { MailOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://grayola.io/wp-content/uploads/2024/05/Group.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-[15rem] w-full max-w-xs flex flex-col items-center justify-center gap-4 rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900">
            <img
              src="https://grayola.io/wp-content/uploads/2024/05/Grayola-Logo-SVG.svg"
              alt="Image"
              className=" h-full w-full dark:brightness-[0.2] dark:grayscale"
            />
            <Link href="/login" className="w-full">
              <Button className="w-full justify-center">
                <MailOpen className="mr-2 h-4 w-4" />
                Inicia sesión con tu Email
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}