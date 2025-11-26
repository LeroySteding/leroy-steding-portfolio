export const metadata = {
  title: "Sanity Studio",
  description: "Content management studio for Leroy Steding Portfolio",
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
