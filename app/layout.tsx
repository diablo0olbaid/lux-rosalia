export const metadata = {
  title: "LUX – Fan Ranking",
  description: "Elegí tu top y exportá un póster para IG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-[#0a1240]">
      <body>{children}</body>
    </html>
  );
}
