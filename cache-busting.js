// Add timestamp to resource URLs to prevent caching issues
document.addEventListener('DOMContentLoaded', function() {
    // Get current timestamp to use as cache-busting parameter
    const timestamp = new Date().getTime();
    
    // Add timestamp to all script sources
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (script.src && !script.src.includes('?')) {
            script.src = script.src + '?v=' + timestamp;
        }
    });
    
    // Add timestamp to all CSS links
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href && !link.href.includes('?')) {
            link.href = link.href + '?v=' + timestamp;
        }
    });
    
    // Add timestamp to all images
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        if (img.src && !img.src.includes('?')) {
            img.src = img.src + '?v=' + timestamp;
        }
    });
    
    console.log('Cache-busting applied to all resources with timestamp: ' + timestamp);
});
