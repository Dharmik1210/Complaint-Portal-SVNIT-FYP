import { useReducer, useEffect, useState } from "react";
import {
  projectFirestore,
  timestamp,
  projectStorage,
} from "../firebase/config";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc, image) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // create new document
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });

      // upload image to storage
      const uploadPath = `complaints/${addedDocument.id}/${addedDocument.id}`;
      const img = await projectStorage.ref(uploadPath).put(image);
      const imgURL = await img.ref.getDownloadURL();

      // update newly created document
      const addUpdatedDocument = {
        ...doc,
        createdAt,
        photoURL: imgURL,
        complaintId: addedDocument.id,
      };
      //console.log(addedDocument.id);
      updateDocument(addedDocument.id, addUpdatedDocument);
      // console.log('id', addedDocument.complaintId);

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addUpdatedDocument,
      });
      return addUpdatedDocument;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // delete image
      const uploadPath = `complaints/${id}/${id}`;
      await projectStorage.ref(uploadPath).delete();

      // delete document
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const updatedDocument = await ref.doc(id).update(updates);

      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (error) {
      console.log(error);
      dispatchIfNotCancelled({ type: "ERROR", payload: error });
      return null;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
