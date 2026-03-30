import { EditorShell } from '@/components/editor/editor-shell';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col overflow-hidden bg-background">
      <EditorShell />
    </main>
  );
}