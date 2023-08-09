import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getStoredNotes, storeNotes } from "db/notes";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);

  return redirect("/notes");
}

export const links: LinksFunction = () => [...newNoteLinks()];
