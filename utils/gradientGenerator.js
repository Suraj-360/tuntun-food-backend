// Predefined gradients including the new one
const predefinedGradients = [
    '7742B2,f180ff,fd8bd9',
    '4158D0,C850C0,FFCC70',
    '0093E9,80D0C7',
    '00DBDE,FC00FF',
    'FBAB7E,F7CE68',
    '85FFBD,FFFB7D',
    '8BC6EC,9599E2',
    'FFDEE9,B5FFFC',
    '08AEEA,2AF598',
    '52ACFF,FFE32C',
    'FFE53B,FF2525',
    '21D4FD,B721FF'
];

// Function to select a random gradient
const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * predefinedGradients.length);
    return predefinedGradients[randomIndex];
};

// Export the gradient generator
module.exports = getRandomGradient;
