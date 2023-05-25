export const hasHrAdminPermission = (roles = []) => {
  if (
    roles.includes("People Admin") ||
    roles.includes("People HR") ||
    roles.includes("People HR Processors")
  ) {
    return true;
  }
  return false;
};
