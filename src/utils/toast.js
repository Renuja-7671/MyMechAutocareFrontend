import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
    },
  });
};

// Info toast
export const showInfo = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
  });
};

// Warning toast
export const showWarning = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#F59E0B',
      color: '#FFFFFF',
    },
  });
};

// Promise toast
export const showPromise = (promise, messages) => {
  return toast.promise(promise, messages, {
    position: 'top-right',
    success: {
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
      },
    },
    error: {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
      },
    },
    loading: {
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
      },
    },
  });
};