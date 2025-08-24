function fetchWallet() {
  const address = document.getElementById("walletAddress").value.trim();
  if (!address) {
    alert("Please enter a wallet address.");
    return;
  }

  const chainId = "eth-mainnet"; // You can make this dynamic later
  const apiKey = "YOUR_COVALENT_API_KEY"; // Replace with your actual key
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.data || !data.data.items) {
        alert("No tokens found or invalid address.");
        return;
      }
      displayTokens(data.data.items);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Failed to fetch wallet data.");
    });
}

function displayTokens(tokens) {
  const container = document.getElementById("walletTokens");
  container.innerHTML = "";

  tokens.forEach(token => {
    const balance = token.balance / Math.pow(10, token.contract_decimals);
    if (balance > 0) {
      const card = document.createElement("div");
      card.className = "token-card";
      card.innerHTML = `
        <img src="${token.logo_url || 'https://via.placeholder.com/40'}" alt="${token.contract_name}" />
        <h3>${token.contract_name}</h3>
        <p>${balance.toFixed(4)} ${token.contract_ticker_symbol}</p>
        <p>$${token.quote.toFixed(2)}</p>
      `;
      container.appendChild(card);
    }
  });
}
