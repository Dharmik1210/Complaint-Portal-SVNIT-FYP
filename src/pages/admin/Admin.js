import { useState } from "react";

// components
import Filter from "../../components/Filter";
import QueryList from "../../components/QueryList";

// styles
import "./Admin.css";

export default function Admin() {
  const [filter, setFilter] = useState("all");
  const filterList = ["all", "hostel", "department", "quarters", "other"];

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // will fetch from database
  const documents = [];

  const queries = documents
    ? documents.filter((document) => {
        switch (filter) {
          case "all":
            return true;
          case "hostel":
          case "department":
          case "quarters":
          case "other":
            return document.category === filter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>
      {queries && (
        <Filter changeFilter={changeFilter} filterList={filterList} />
      )}
      {queries && <QueryList queries={queries} />}
    </div>
  );
}
