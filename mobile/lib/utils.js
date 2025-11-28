export function formatMemberSince(dateString) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";
    const month=date.toLocaleString("default", {month:'short'});
    const year=date.getFullYear();
    return `${month} ${year}`;
    }

export function formatPublishdate(dateString) {
    const date = new Date(dateString);
    const month=date.toLocaleString("default", {month:'short'});
    const year=date.getFullYear();
    const day=date.getDate();
    return `${month} ${year}`;
    }