export function showLoading(isLoading) {
    return {
      type: 'SHOWLOADING',
      payload: isLoading
    }
  }

  export function hideLoading(isLoading) {
    return {
      type: 'HIDELOADING',
      payload: isLoading
    }
  }