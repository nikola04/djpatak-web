export function isParentOf(parent: HTMLElement|null, node: HTMLElement|ParentNode|null): boolean{
    if(!parent) return false;
    if(!node) return false;
    if(node == parent) return true;
    return isParentOf(parent, node.parentNode);
}

export function capitilizeWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  }

  // Function to calculate the luminance of a color
const calculateLuminance = (r: number, g: number, b: number) => {
    // Normalize RGB values to a 0-1 range
    const normalized = [r, g, b].map(value => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    // Luminance formula (rec. 709)
    return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2];
};

// Lighten or darken a color based on the `lighten` flag
const lightenOrDarken = (value: number, percent: number, lighten: boolean = true) => {
    if (lighten) return Math.min(255, Math.floor(value + (255 - value) * percent)); // lighten
    return Math.max(0, Math.floor(value * (1 - percent))); // darken
};

export const generateRoleColorSet = (colorInt: number) => {
    const primary = '#' + colorInt.toString(16).padStart(6, '0');

    const red = (colorInt >> 16) & 255;
    const green = (colorInt >> 8) & 255;
    const blue = colorInt & 255;

    // Calculate luminance to determine if the primary color is light or dark
    const luminance = calculateLuminance(red, green, blue);

    const isLight = luminance >= 0.5; // Threshold for light vs. dark color
    const adjustmentPercentage = 0.85;

    // Based on the luminance, decide whether to lighten or darken the secondary color
    const secondaryRed = lightenOrDarken(red, adjustmentPercentage, !isLight); // Darken if primary is light, lighten if primary is dark
    const secondaryGreen = lightenOrDarken(green, adjustmentPercentage, !isLight);
    const secondaryBlue = lightenOrDarken(blue, adjustmentPercentage, !isLight);

    const secondary = `#${((1 << 24) + (secondaryRed << 16) + (secondaryGreen << 8) + secondaryBlue).toString(16).slice(1)}`;

    return [primary, secondary];
};

// Example usage:
const [primary, secondary] = generateRoleColorSet(0x3498db);
console.log(primary);   // Output: #3498db (Original color)
console.log(secondary); // Output: a contrasting color based on the primary's luminance