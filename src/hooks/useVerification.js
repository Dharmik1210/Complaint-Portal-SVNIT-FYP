import { useState, useEffect } from 'react';

export const useVerification = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);

  const verification = async (user) => {
    setError(null);

    try {
      // send verification email
      await user.sendEmailVerification({
        url: "https://complaint-portal-svnit.vercel.app/"
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

  return { verification, error };
};
