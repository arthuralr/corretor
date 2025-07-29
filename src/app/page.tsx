import { redirect } from 'next/navigation';

export default function Home() {
  // Redirects the root path to the public homepage
  redirect('/inicio');
}
