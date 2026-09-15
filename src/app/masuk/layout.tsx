export default function AuthLayout({ children }: LayoutProps<"/masuk">) {
  return (
    <div className="bg-muted/30 flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </div>
    </div>
  );
}
