import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Constants from '../../constants/constants';
import { format } from 'date-fns';
import { useState } from 'react';
import { useEffect } from 'react';
import Lightbox from 'react-awesome-lightbox';
import Swal from 'sweetalert2';
import 'react-awesome-lightbox/build/style.css';

// styles
import './Query.css';

export default function Query() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const { updateDocument, response: updateRes } = useFirestore('users');
  const {
    deleteDocument,
    updateDocument: updatedComplaint,
    response: deleteRes,
  } = useFirestore('complaints');
  const [complaint, setComplaint] = useState(null);
  const { document: complaintDoc, error: complaintError } = useDocument(
    'complaints',
    id
  );
  const { document: userDoc, error: userError } = useDocument(
    'users',
    complaint ? complaint.createdBy.id : user.uid
  );
  const { document: superAdmin, error: superAdminError } = useDocument(
    'users',
    Constants.SUPER_ADMIN_ID
  );
  const { document: A, error: AError } = useDocument('users', Constants.A_ID);
  const { document: B, error: BError } = useDocument('users', Constants.B_ID);
  const { document: C, error: CError } = useDocument('users', Constants.C_ID);
  const [userObj, setUserObj] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log(userDoc);

  // fetch from database
  useEffect(() => {
    if (complaintDoc) {
      setComplaint(complaintDoc);
    }
    if (userDoc) {
      if (userDoc.adminType !== 'student') {
        setIsAdmin(true);
      }
      setUserObj(userDoc);
    }
  }, [complaintDoc, userDoc]);

  const openLightbox = () => {
    setLightboxIsOpen(true);
  };

  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const formattedDate = format(date, 'dd-MM-yyyy HH:mm:ss');
    return formattedDate;
  };

  const deleteComplaint = (object) => {
    const { id: uid, ...newObject } = object;

    const updatedObject = {
      ...newObject,
      complaints: newObject.complaints.filter(
        (complaint) => complaint.complaintId !== id
      ),
    };

    updateDocument(uid, updatedObject);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to delete this complaint?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // delete complaint from individual schema
        deleteComplaint(userObj);
        deleteComplaint(superAdmin);

        if (complaint.type === 'A') {
          deleteComplaint(A);
        } else if (complaint.type === 'B') {
          deleteComplaint(B);
        } else if (complaint.type === 'C') {
          deleteComplaint(C);
        }

        // delete from complaints schema
        deleteDocument(id);

        Swal.fire('Deleted!', 'The complaint has been deleted.', 'success');
        navigate('/');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The complaint has not been deleted.', 'error');
      }
    });
  };

  const updateSchema = (object, status) => {
    const { id: uid, ...newObject } = object;

    const updatedComplaints = newObject.complaints.map((complaint) => {
      if (complaint.complaintId === id) {
        return { ...complaint, status: status };
      }
      return complaint;
    });

    const updatedObject = { ...newObject, complaints: updatedComplaints };
    updateDocument(uid, updatedObject);
  };

  const handleStatusChange = (status) => {
    if (status === 'accepted') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This will mark complaint as Resolved',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          if (userObj && superAdmin && A && B && C) {
            updateSchema(userObj, status);
            updateSchema(superAdmin, status);

            if (complaint.type === 'A') {
              updateSchema(A, status);
            } else if (complaint.type === 'B') {
              updateSchema(B, status);
            } else if (complaint.type === 'C') {
              updateSchema(C, status);
            }
          }

          // update complaint schema
          const updateComplaint = { ...complaint, status: status };
          updatedComplaint(id, updateComplaint);
          Swal.fire('Resolved!', 'Complaint marked as resolved', 'success');
          navigate('/');
        }
      });
    } else if (status === 'rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This will mark complaint as rejected',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          if (userObj && superAdmin && A && B && C) {
            updateSchema(userObj, status);
            updateSchema(superAdmin, status);

            if (complaint.type === 'A') {
              updateSchema(A, status);
            } else if (complaint.type === 'B') {
              updateSchema(B, status);
            } else if (complaint.type === 'C') {
              updateSchema(C, status);
            }
          }

          // update complaint schema
          const updateComplaint = { ...complaint, status: status };
          updatedComplaint(id, updateComplaint);
          Swal.fire('Rejected!', 'Complaint marked as rejected', 'success');
          navigate('/');
        }
      });
    }
  };

  return (
    <div>
      {complaint && (
        <div className="query-content">
          <h3>Complaint Details</h3>
          <hr />
          <div className="query">
            <div className="query-summary">
              <ul>
                <li>
                  <span>ID :</span> {complaint.complaintId}
                  <p className="details">
                    Created On {formatDate(complaint.createdAt)}
                  </p>
                </li>
                <li>
                  <span>Type :</span> {complaint.type}
                </li>
                <li>
                  <span>Details:</span> {complaint.details}
                </li>
                <li>
                  <span>Building :</span> {complaint.building}
                </li>
                <li>
                  <span>Exact Location: </span> {complaint.exactLocation}
                </li>
                <li>
                  <span>Status:</span> {complaint.status}
                </li>
                <li>
                  <span>Raised By:</span>{' '}
                  <Link to={`/profile/${complaint.createdBy.id}`}>
                    {complaint.createdBy.displayName}
                  </Link>
                </li>
              </ul>
            </div>
            {complaint.status === 'pending' &&
              !(updateRes.isPending || deleteRes.isPending) &&
              !isAdmin && (
                <button className="btn" onClick={handleDelete}>
                  Delete Complaint
                </button>
              )}
            {(updateRes.isPending || deleteRes.isPending) && !isAdmin && (
              <button className="btn" disabled>
                Please Wait
              </button>
            )}
            <div className="accept">
              {complaint.status === 'pending' && isAdmin && (
                <button
                  className="btn"
                  onClick={() => handleStatusChange('accepted')}
                >
                  Solved
                </button>
              )}
              {complaint.status === 'pending' && isAdmin && (
                <button
                  className="btn"
                  onClick={() => handleStatusChange('rejected')}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
          <div>
            <img
              className="image"
              src={complaint.photoURL}
              alt={complaint.complaintId}
              onClick={openLightbox}
            />
            {lightboxIsOpen && (
              <Lightbox
                image={complaint.photoURL}
                title={complaint.complaintId}
                onClose={closeLightbox}
              />
            )}
            <center>
              <p>[ Click above image to get better view ]</p>
            </center>
          </div>
        </div>
      )}
      {complaintError && <p className="error">{complaintError}</p>}
      {userError && <p className="error">{userError}</p>}
      {superAdminError && <p className="error">{superAdminError}</p>}
      {AError && <p className="error">{AError}</p>}
      {BError && <p className="error">{BError}</p>}
      {CError && <p className="error">{CError}</p>}
    </div>
  );
}
