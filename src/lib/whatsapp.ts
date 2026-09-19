export const openWhatsApp = (phone: string, text: string = '') => {
    // Format phone number to start with 62 instead of 0 or +62
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
    }
    
    const encodedText = encodeURIComponent(text);
    
    // Check if user is on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    
    if (isMobile) {
        window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`, '_blank');
    } else {
        window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`, '_blank');
    }
};
