// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

const getRandom = () => {
    return Math.random();
};

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;  //The maximum is exclusive and the minimum is inclusive
};

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;  //The maximum is inclusive and the minimum is inclusive 
};

export {
    getRandom,
    getRandomArbitrary,
    getRandomInt,
    getRandomIntInclusive
};
