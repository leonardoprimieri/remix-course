import { json, type LinksFunction } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import styles from "../../styles/note-details.css";
import { getStoredNotes } from "db/notes";

export default function NoteDetailsPage() {
  const data = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to Notes</Link>
        </nav>
        <h1>{data.title}</h1>
      </header>

      <p id="note-details-content">{data.content}</p>
    </main>
  );
}

export const meta = ({ data }) => ({
  title: data.title,
  description: "A list of notes",
});

export async function loader({ params }: { params: { noteId: string } }) {
  const notes = await getStoredNotes();

  const selectedNote = notes.find((note) => note.id === params.noteId);

  if (!selectedNote) {
    throw json(
      {
        message: "Could not find note",
      },
      {
        status: 404,
      }
    );
  }

  return selectedNote;
}

export function CatchBoundary() {
  const error = useCatch();

  return (
    <main>
      <p className="info-message">{error?.data?.message}</p>
    </main>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
