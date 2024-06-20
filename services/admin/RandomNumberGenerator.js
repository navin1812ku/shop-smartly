function randomNumber() {
    const max = BigInt("100000000000000000");
    const random = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    const factor = max / BigInt(Number.MAX_SAFE_INTEGER);
    return random * factor;
}

module.exports = { randomNumber };