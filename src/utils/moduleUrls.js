// src/utils/moduleUrls.js
const moduleUrls = {
    'Dashboard': {
        view: 'http://localhost:3000/admin'
    },
    'Mentor': {
        view: 'http://localhost:3000/admin/approved-mentors',
        edit: 'http://localhost:3000/admin/approved-mentors/edit',
        delete: 'http://localhost:3000/admin/approved-mentors/delete',
        pending: 'http://localhost:3000/admin/pending-mentors'
    },
    'Mentee': {
        view: 'http://localhost:3000/admin/mentee-list'
    },
    'Booking List': {
        view: 'https://v7.checkprojectstatus.com:3020/admin/booking-list'
    },
    'Mentorship Categories': {
        view: 'http://localhost:3000/admin/category-list'
    },
    'Transactions': {
        view: 'https://v7.checkprojectstatus.com:3020/admin/transactions-list'
    },
    'Dispute Management': {
        view: 'https://v7.checkprojectstatus.com:3020/admin/dispute-management'
    },
    'Mentorship Goals': {
        view: 'https://v7.checkprojectstatus.com:3020/admin/goal-list'
    },
    'Blogs': {
        view: 'https://v7.checkprojectstatus.com:3020/admin/blog'
    },
    'Settings': {
        view: 'http://localhost:3000/admin/generalsettings'
    },
    'Help-&-support': {
        view: 'http://localhost:3000/admin/help-support'
    }
};

export default moduleUrls;