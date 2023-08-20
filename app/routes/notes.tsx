import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getStoredNotes, storeNotes } from "db/notes";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as notListLinks } from "~/components/NoteList";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
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

export const links: LinksFunction = () => [
  ...newNoteLinks(),
  ...notListLinks(),
];
