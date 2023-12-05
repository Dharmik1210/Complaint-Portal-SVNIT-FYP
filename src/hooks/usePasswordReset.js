import { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const usePasswordReset = () => {
  const auth = getAuth();
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);

  const passwordReset = async (email) => {
    setError(null);

    try {
      // send passwordReset email
      await sendPasswordResetEmail(auth, email, {
        url: "https://complaint-portal-svnit.vercel.app/",
      });

      if (!isCancelled) {
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { passwordReset, error };
};
