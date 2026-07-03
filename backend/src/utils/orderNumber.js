function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100);
  return `BMB-${stamp}-${random}`;
}

module.exports = generateOrderNumber;
