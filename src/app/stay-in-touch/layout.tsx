import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stay in Touch with Elevatia',
  description: "Choose whether to receive occasional updates and insights from Elevatia. No pressure—only relevant information when there's something worth sharing.",
};

export default function StayInTouchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

