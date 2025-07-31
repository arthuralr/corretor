
'use client'

import { redirect } from 'next/navigation';

// This component is to permanently redirect from the old /imovel/[id] path
// to the new /imoveis/[id] path to solve the parallel routes error.
export default function RedirectImovelPage({ params }: { params: { id: string } }) {
  redirect(`/imoveis/${params.id}`);
}
