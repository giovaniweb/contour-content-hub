import { fixUserProfile } from '@/services/adminService';

/**
 * Utility to fix the specific user with empty profile fields
 * This should be called once to patch the problematic user
 */
export const fixSpecificUser = async () => {
  const userId = '9dbb1f16-bfe2-4881-abe9-0ed020904494';
  
  try {
    console.log('Fixing empty profile for user:', userId);
    const result = await fixUserProfile(userId);
    console.log('Profile fixed successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to fix profile:', error);
    throw error;
  }
};

// Auto-execute when imported (for immediate fix)
if (typeof window !== 'undefined') {
  // Only run in browser, not during SSR
  fixSpecificUser()
    .then(() => console.log('✅ User profile automatically fixed'))
    .catch(() => console.log('❌ Failed to auto-fix profile'));
}