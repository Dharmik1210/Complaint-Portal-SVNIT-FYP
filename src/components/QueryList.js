import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./QueryList.css";

export default function QueryList({ queries, isAdmin, keyword }) {
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

  const highlightMatchedText = (text) => {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();

    if (!lowerText.includes(lowerKeyword)) {
      return text;
    }

    const startIndex = lowerText.indexOf(lowerKeyword);
    const endIndex = startIndex + keyword.length;

    return (
      <>
        {text.substring(0, startIndex)}
        <span className="highlighted-text">
          {text.substring(startIndex, endIndex)}
        </span>
        {text.substring(endIndex)}
      </>
    );
  };

  return (
    <div className="query-list">
      {queries.length === 0 && <p>No complaints yet!</p>}
      {queries.map((query) => (
        <Link to={`/query/${query.complaintId}`} key={query.complaintId}>
          <h3>{highlightMatchedText(query.type.label)}</h3>
          <p>Created on {highlightMatchedText(formatDate(query.createdAt))}</p>
          <h4>{highlightMatchedText(textDetails(query.details, 38))}</h4>
          {isAdmin && (
            <div className="query-by">
              <h4>
                Complaint raised by :{" "}
                <Link
                  className="profile-link"
                  to={`/profile/${query.createdBy.id}`}
                >
                  {highlightMatchedText(query.createdBy.admissionNo)}
                </Link>
              </h4>
            </div>
          )}
          {query.status !== "pending" && (
            <div className="query-by">
              <h4>
                Complaint {query.status} by :{" "}
                <Link
                  className="profile-link"
                  to={`/profile/${query.resolvedBy.id}`}
                >
                  {highlightMatchedText(query.resolvedBy.displayName)}
                </Link>
              </h4>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
