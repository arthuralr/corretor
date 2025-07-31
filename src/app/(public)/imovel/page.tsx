
import { redirect } from 'next/navigation';

// This page only exists to redirect to the correct pluralized route.
export default function ImovelRedirectPage() {
  redirect('/imoveis');
}
