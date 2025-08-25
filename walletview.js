function fetchWallet() {
  const address = document.getElementById("walletAddress").value.trim();
  const container = document.getElementById("walletTokens");
  container.innerHTML = ""; // Clear previous results

  // ✅ Validate wallet format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    alert("Invalid wallet address format.");
    return;
  }

  // 🔄 Show loading spinner
  container.innerHTML = "<p style='color:#00ffcc;'>Loading wallet data...</p>";

  const chainId = "eth-mainnet";
  const apiKey = "cqt_rQMm9GR8VbCtb79dTtq9Pb7fT9dT"; // Replace with your actual key
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      if (!data.data || !data.data.items || data.data.items.length === 0) {
        container.innerHTML = "<p style='color:#ff6666;'>No tokens found for this wallet.</p>";
        return;
      }
      displayTokens(data.data.items);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      container.innerHTML = `<p style='color:#ff6666;'>Error: ${err.message}</p>`;
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

  if (container.innerHTML === "") {
    container.innerHTML = "<p style='color:#ffcc00;'>No tokens with non-zero balance found.</p>";
  }
}
