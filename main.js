function Cell() {
  let value = null;
  const addToken = (playerToken) => (value = playerToken);
  const getToken = () => value;
}
