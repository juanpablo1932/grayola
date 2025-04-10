import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import Login from "./Login"

export function LoginCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent className="grid p-0 md:grid-cols-2">
          <Login/>
          <div className="relative hidden bg-muted md:block bg-white">
            <img
              src="https://grayola.io/wp-content/uploads/2024/05/Group.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
