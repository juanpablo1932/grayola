import { Button } from "@/components/ui/button";
import { logout } from "@/utils/supabase/logout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="absolute right-0 m-5">
        <Button variant="destructive" onClick={logout}>
          Cerrar Sesión
        </Button>
      </div>
      {children}
    </>
  );
}
