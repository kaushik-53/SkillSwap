/**
 * Formats an image URL properly, ensuring relative paths from the backend 
 * correctly point to the API server when the frontend is running separately.
 * 
 * @param {string} url - The URL (absolute or relative)
 * @returns {string} The fully qualified image URL
 */
export const getImageUrl = (url) => {
    if (!url) return '';
    
    // If it's already a full HTTP/HTTPS url (like ui-avatars), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If it's a relative path (e.g. /uploads/image.jpg), prepend the API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Ensure we don't double up on slashes
    if (url.startsWith('/') && apiUrl.endsWith('/')) {
        return `${apiUrl.slice(0, -1)}${url}`;
    } else if (!url.startsWith('/') && !apiUrl.endsWith('/')) {
        return `${apiUrl}/${url}`;
    }
    
    return `${apiUrl}${url}`;
};

// These domains are known placeholder/broken avatar sources that should not be shown
const INVALID_AVATAR_DOMAINS = ['via.placeholder.com', 'placeholder.com'];

/**
 * Returns a guaranteed-visible avatar URL.
 * - If the user has a valid uploaded avatar, it returns the properly resolved URL.
 * - Otherwise, returns a generated colorful avatar from ui-avatars.com based on the name.
 * 
 * @param {string} avatar - The stored avatar URL (can be relative path, full URL, or placeholder)
 * @param {string} name - The user's display name (used as fallback)
 * @returns {string} A valid, renderable image URL
 */
export const getAvatarUrl = (avatar, name) => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=128&bold=true`;

    if (!avatar) return fallback;

    // Reject old placeholder.com URLs
    if (INVALID_AVATAR_DOMAINS.some(domain => avatar.includes(domain))) {
        return fallback;
    }

    return getImageUrl(avatar);
};
