export const ROLES = {
  CLIENT: "CLIENT",
  COUNSELOR: "COUNSELOR",
  ADMIN: "ADMIN",
};

export const getHomePath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.COUNSELOR:
      return "/counselor";
    case ROLES.CLIENT:
      return "/dashboard";
    default:
      return "/";
  }
};