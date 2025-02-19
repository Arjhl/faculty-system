//title
//url
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import Document from "../../components/Documents";
import Link from "next/link";

export default function Conferences() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [url, seturl] = useState(null);
  const [owner, setOwner] = useState(null);
  const [storedDocuments, setStoredDocuments] = useState([]);

  useEffect(() => {
    getDocuments();
  }, [session]);

  const getDocuments = async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("documents")
        .select(`id, title, url`)
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setStoredDocuments(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const addDocument = async ({ title, url }) => {
    try {
      setLoading(true);

      const updates = {
        user_id: user.id,
        title,
        url,
        owner,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert([updates]);

      if (error) throw error;
      alert("New Document added successfully!");
      router.reload(window.location.pathname);
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "4em auto",
        }}
        className="container"
      >
        <Link href={"/"}>Homepage</Link>
        <Link href={"/home/qualifications"}>Qualifications</Link>
        <Link href={"/home/journals"}>Journals</Link>
        <Link href={"/home/conferences"}>Conferences</Link>
        <Link href={"/home/documents"}>Documents</Link>
      </div>
      <div style={{ margin: "1rem" }}>
        <h2 className="head_center">Add New Document</h2>
        <div className="container">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="url">URL</label>
          <input
            type="text"
            name="url"
            id="url"
            onChange={(e) => {
              return seturl(e.target.value);
            }}
          />
          <label htmlFor="owner">Owner</label>
          <input
            type="text"
            name="owner"
            id="url"
            onChange={(e) => {
              return setOwner(e.target.value);
            }}
          />
          <button
            type="submit"
            style={{ margin: "1rem auto" }}
            onClick={() =>
              addDocument({
                title,
                url,
              })
            }
          >
            {loading ? "Loading ..." : "Insert"}
          </button>
        </div>

        <h1 className="head_center">Documents</h1>
        <Document docs={storedDocuments} />
      </div>
    </>
  );
}
