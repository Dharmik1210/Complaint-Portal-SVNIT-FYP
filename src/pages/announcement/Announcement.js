import { useEffect, useState } from "react";
import constants from "../../constants/constants";
import { useDocument } from "../../hooks/useDocument";
import { useFirestore } from "../../hooks/useFirestore";
import Swal from "sweetalert2";

import "./Announcement.css";

export default function Announcement() {
  const [details, setDetails] = useState("");
  const { document, error } = useDocument(
    "announcement",
    constants.ANNOUNCEMENT_ID
  );
  const { updateDocument } = useFirestore("announcement");
  const [announcement, setAnnouncement] = useState("");

  const broadcastAnnouncement = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to announce this?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const newDocument = { note: details };
        updateDocument(constants.ANNOUNCEMENT_ID, newDocument);
        Swal.fire("Announced!", "The announcement has been done.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "The announcement has not been done.", "error");
      }
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to delete this announce?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const newDocument = { note: "" };
        updateDocument(constants.ANNOUNCEMENT_ID, newDocument);
        Swal.fire("Deleted!", "The announcement has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "The announcement has not been deleted.", "error");
      }
    });
  };

  useEffect(() => {
    if (document) {
      setAnnouncement(document.note);
    }
  }, [document]);

  return (
    <div>
      {announcement !== "" && (
        <div className="announcement-content">
          <h3>Announcement</h3>
          <hr />
          <div className="announcement">
            <div className="announcement-summary">
              <ul>
                <li>{announcement}</li>
              </ul>
            </div>
            <button className="btn" onClick={handleDelete}>
              Delete Announcement
            </button>
          </div>
        </div>
      )}
      {announcement === "" && (
        <div className="create-form">
          <h2>Broadcast new Announcement</h2>
          <form onSubmit={broadcastAnnouncement}>
            <label>
              <span>Details:</span>
              <textarea
                required
                onChange={(e) => setDetails(e.target.value)}
                value={details}
              ></textarea>
            </label>
            <button className="btn">Announce</button>
          </form>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
