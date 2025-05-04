
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * A hook that provides access to the authenticated user
 * This is a convenience wrapper around useAuth that provides just the user data
 */
export const useUser = () => {
  const { user, isLoading } = useAuth();
  
  return {
    user,
    isLoading
  };
};
