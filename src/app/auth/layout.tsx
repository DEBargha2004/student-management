export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh h-fit flex justify-center items-center p-10">
      {children}
    </main>
  );
}
