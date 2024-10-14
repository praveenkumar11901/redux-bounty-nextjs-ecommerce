export function getRoleBasedRedirectPath(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'SELLER':
      return '/seller/dashboard';
    case 'SHOPPER':
      return '/shopper/dashboard';
    default:
      return '/';
  }
}
