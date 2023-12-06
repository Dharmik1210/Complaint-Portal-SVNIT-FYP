import { useState, useEffect, useRef } from "react";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { format } from "date-fns";

// components
import Filter from "../../components/Filter";
import QueryList from "../../components/QueryList";
import Marquee from "react-fast-marquee";
import constants from "../../constants/constants";
import SearchIcon from "../../assets/search_icon.svg";

// styles
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { document, error } = useDocument("users", user.uid);
  const { document: announcement } = useDocument(
    "announcement",
    constants.ANNOUNCEMENT_ID
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [complaints, setComplaints] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const filterList = ["all", "hostel", "department", "quarters", "other"];

  useEffect(() => {
    if (document) {
      const pendingComplaints = document.complaints.filter(
        (complaint) => complaint.status === "pending"
      );
      setComplaints(pendingComplaints);
      setIsAdmin(document.adminType !== "student");
    }
  }, [document]);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const tempQueries = complaints
    ? complaints.filter((document) => {
        switch (filter) {
          case "all":
            return true;
          case "hostels":
            return (
              document.building === "ews-bhavan" ||
              document.building === "tagore-bhavan" ||
              document.building === "sarabhai-bhavan" ||
              document.building === "raman-bhavan" ||
              document.building === "nehru-bhavan" ||
              document.building === "narmad-bhavan" ||
              document.building === "gajjar-bhavan" ||
              document.building === "mother-teresa-bhavan" ||
              document.building === "bhabha-bhavan" ||
              document.building === "swami-bhavan"
            );
          case "departments":
            return (
              document.building === "cse" ||
              document.building === "ai" ||
              document.building === "ece" ||
              document.building === "ee" ||
              document.building === "me" ||
              document.building === "ce" ||
              document.building === "ch" ||
              document.building === "chemistry" ||
              document.building === "mathematics" ||
              document.building === "physics" ||
              document.building === "management-studies" ||
              document.building === "humanities"
            );
          case "ews-bhavan":
          case "tagore-bhavan":
          case "sarabhai-bhavan":
          case "raman-bhavan":
          case "nehru-bhavan":
          case "narmad-bhavan":
          case "gajjar-bhavan":
          case "mother-teresa-bhavan":
          case "bhabha-bhavan":
          case "swami-bhavan":
          case "cse":
          case "ai":
          case "ece":
          case "ee":
          case "me":
          case "ce":
          case "ch":
          case "chemistry":
          case "mathematics":
          case "physics":
          case "management-studies":
          case "humanities":
          case "quarters":
          case "other":
            return document.building === filter;
          default:
            return true;
        }
      })
    : null;

  const textDetails = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + "...";
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const formattedDate = format(date, "dd-MM-yyyy HH:mm:ss");
    return formattedDate;
  };

  const queries = tempQueries
    ? tempQueries.filter((query) => {
        const admissionNoCondition =
          user.photoURL !== "student" &&
          query.createdBy.admissionNo
            .toLowerCase()
            .includes(keyword.toLowerCase());

        return (
          textDetails(query.details, 38)
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          query.type.label.toLowerCase().includes(keyword.toLowerCase()) ||
          admissionNoCondition ||
          formatDate(query.createdAt)
            .toLowerCase()
            .includes(keyword.toLowerCase())
        );
      })
    : null;

  return (
    <div className="dashboard">
      {announcement && announcement.note !== "" && (
        <Marquee pauseOnHover={true} speed={40} className="announcement">
          {announcement.note}
        </Marquee>
      )}
      {queries && (
        <Filter changeFilter={changeFilter} filterList={filterList} type="location" />
      )}
      {queries && (
        <div className="search-container">
          <img src={SearchIcon} alt="search icon" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            className="search-input"
          />
        </div>
      )}
      {queries && (
        <QueryList queries={queries} isAdmin={isAdmin} keyword={keyword} />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
