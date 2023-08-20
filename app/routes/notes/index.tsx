import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
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

  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes" },
      {
        status: 404,
      }
    );
  }

  return notes;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return {
      message: "Invalid title",
    };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatedNotes = existingNotes.concat(noteData);

  await new Promise((resolve) => setTimeout(() => resolve(null), 1000));

  await storeNotes(updatedNotes);

  return redirect("/notes");
}

export const links: LinksFunction = () => [
  ...newNoteLinks(),
  ...notListLinks(),
];

export const meta = {
  title: "Notes",
  description: "A list of notes",
};

export function CatchBoundary() {
  const error = useCatch();

  return (
    <main>
      <NewNote />
      <p className="info-message">{error?.data?.message}</p>
    </main>
  );
}
