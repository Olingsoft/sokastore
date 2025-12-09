// Test image URL construction
const apiUrl = 'https://sokastoreapi.onrender.com/api';
const baseUrl = apiUrl.replace(/\/api\/?$/, '');

const testCases = [
    '/uploads/products/product-1763488163189-968515588.png',
    'uploads/products/product-1763488163189-968515588.png',
    '/public/uploads/products/product-1763488163189-968515588.png',
    'public/uploads/products/product-1763488163189-968515588.png',
    'https://example.com/image.png'
];

console.log('API URL:', apiUrl);
console.log('Base URL:', baseUrl);
console.log('\nTest Cases:\n');

testCases.forEach(imagePath => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log(`Input: ${imagePath}`);
        console.log(`Output: ${imagePath}`);
        console.log('---');
        return;
    }

    const normalizedPath = imagePath.trim().replace(/^\/+/, '').replace(/^public\//, '');
    const fullUrl = `${baseUrl}/${normalizedPath}`;

    console.log(`Input: ${imagePath}`);
    console.log(`Normalized: ${normalizedPath}`);
    console.log(`Output: ${fullUrl}`);
    console.log('---');
});
