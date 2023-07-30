import { Sidebar } from '@/components/Sidebar';
import Head from 'next/head';
import ChatBot from '../components/Chatbot/index';

export default function Home() {

  return (
    <div className="min-h-screen bg-blue-dark text-white">
      <Head>
        <title>Vortex Chatbot</title>
        <meta name="description" content="Vortex chatbot app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        {/* <Sidebar /> */}
        <ChatBot/>
      </main>
    </div>
  );
}