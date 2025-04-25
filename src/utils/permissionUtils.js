// src/utils/permissionUtils.js

/**
 * Checks if user has permission for a specific module and action
 * @param {Object} permissions - User's permissions object
 * @param {string} module - Module name (e.g., 'Mentor', 'Dashboard')
 * @param {'view'|'create'|'edit'|'delete'} action - Action to check
 * @returns {Object} { hasPermission: boolean, url: string }
 */
export const checkPermission = (permissions, module, action) => {
    if (!permissions || !module || !action) {
      return { hasPermission: false, url: null };
    }
  
    // Normalize module name
    const normalizedModule = module
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-')
      .toLowerCase();
  
    // Action mapping
    const actionMap = {
      'view': 'isRead',
      'create': 'isAdd',
      'edit': 'isUpdate',
      'delete': 'isDelete'
    };
  
    const actionKey = actionMap[action];
    const modulePerms = permissions[normalizedModule];
  
    if (!modulePerms) {
      return { hasPermission: false, url: null };
    }
  
    return {
      hasPermission: !!modulePerms[actionKey],
      url: modulePerms?.urls?.[action] || getDefaultUrl(normalizedModule, action)
    };
  };
  
  /**
   * Generates default URL for a module and action
   */
  const getDefaultUrl = (module, action) => {
    const basePath = module.toLowerCase()
      .replace(/-/g, '')
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-');
  
    const urlMap = {
      'helpandsupport': {
        view: '/support',
        edit: '/support/edit'
      },
      'mentorshipcategories': {
        view: '/categories'
      }
    };
  
    return urlMap[basePath]?.[action] || `/${basePath}/${action}`;
  };
  
  // Helper functions (aligned with your permission table)
  export const canViewMentor = (p) => checkPermission(p, 'Mentor', 'view');
  export const canEditMentor = (p) => checkPermission(p, 'Mentor', 'edit');
  export const canDeleteMentor = (p) => checkPermission(p, 'Mentor', 'delete');
  
  export const canViewDashboard = (p) => checkPermission(p, 'Dashboard', 'view');
  export const canEditDashboard = (p) => checkPermission(p, 'Dashboard', 'edit');
  
  export const canViewHelpAndSupport = (p) => checkPermission(p, 'Help & support', 'view');
  export const canEditHelpAndSupport = (p) => checkPermission(p, 'Help & support', 'edit');
  
  export const canViewDisputeManagement = (p) => checkPermission(p, 'Dispute Management', 'view');
  export const canCreateDisputeManagement = (p) => checkPermission(p, 'Dispute Management', 'create');
  export const canEditDisputeManagement = (p) => checkPermission(p, 'Dispute Management', 'edit');
  export const canDeleteDisputeManagement = (p) => checkPermission(p, 'Dispute Management', 'delete');
  
  // For modules with no permissions in your table
  export const canViewMentorshipCategories = (p) => checkPermission(p, 'Mentorship Categories', 'view');
  export const canViewBookingList = (p) => checkPermission(p, 'Booking List', 'view');
  export const canViewMentee = (p) => checkPermission(p, 'Mentee', 'view');
  export const canCreateMentee = (p) => checkPermission(p, 'Mentee', 'create');
  export const canDeleteMentee = (p) => checkPermission(p, 'Mentee', 'delete');
  export const canViewSettings = (p) => checkPermission(p, 'Settings', 'view');
  export const canViewBlogs = (p) => checkPermission(p, 'Blogs', 'view');
  export const canViewMentorshipGoals = (p) => checkPermission(p, 'Mentorship Goals', 'view');
  export const canViewTransactions = (p) => checkPermission(p, 'Transactions', 'view');