import { Link } from 'react-router-dom';
import { format } from 'date-fns';
// styles
import './QueryList.css';

export default function QueryList({ queries, isAdmin }) {
  function textDetails(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + '...';
    }
  }
  function formatDate(timestamp) {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const formattedDate = format(date, 'dd-MM-yyyy HH:mm:ss');
    return formattedDate;
  }

  return (
    <div className="query-list">
      {queries.length === 0 && <p>No complaints yet!</p>}
      {queries.map((query) => (
        <Link to={`/query/${query.complaintId}`} key={query.complaintId}>
          <h3>{query.type}</h3>
          <p>Created on {formatDate(query.createdAt)}</p>
          <h4>{textDetails(query.details, 40)}</h4>
          {isAdmin && (
            <div className="query-by">
              <h4>
                Complaint raised by :{' '}
                <Link
                  className="profile-link"
                  to={`/profile/${query.createdBy.id}`}
                >
                  {query.createdBy.displayName}
                </Link>
              </h4>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
