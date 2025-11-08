import feather from "@/../public/feather.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AppLogo({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative", className)} {...props}>
      <h1 className="font-extrabold text-lg bg-linear-to-r from-sky-400 to-green-400 text-transparent bg-clip-text">
        Bansuri Academy
      </h1>
      <Image
        src={feather}
        alt="feather"
        height={50}
        width={60}
        className="object-cover absolute -right-10 top-1/2 -translate-y-1/3 scale-75"
      />
    </div>
  );
}
