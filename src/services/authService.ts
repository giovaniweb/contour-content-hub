
// Este arquivo agora serve apenas como um ponto de exportação para evitar
// problemas com importações existentes. As implementações reais foram movidas
// para arquivos específicos em src/services/auth/

import {
  fetchUserProfile,
  updateUserProfile,
  validateRole,
} from './auth/userProfile';

import {
  loginWithEmailAndPassword,
  registerUser,
  logoutUser,
  updateUserPassword,
} from './auth/authentication';

import {
  fetchWorkspaces,
  fetchWorkspaceUsers,
} from './auth/workspaces';

import {
  inviteUserToWorkspace,
  fetchUserInvites,
  acceptInvite,
  rejectInvite,
} from './auth/invites';

// Re-exporte todas as funções para manter a compatibilidade com o código existente
export {
  fetchUserProfile,
  loginWithEmailAndPassword,
  registerUser,
  logoutUser,
  updateUserPassword,
  updateUserProfile,
  fetchWorkspaces,
  inviteUserToWorkspace,
  fetchUserInvites,
  acceptInvite,
  rejectInvite,
  fetchWorkspaceUsers,
  validateRole,
};
