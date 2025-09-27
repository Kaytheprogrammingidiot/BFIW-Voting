const form = document.getElementById('voteForm');
const resultsDiv = document.getElementById('results');

// Force cache-busting to always get fresh JSON
const jsonURL = 'https://raw.githubusercontent.com/Kaytheprogrammingidiot/bv/refs/heads/main/v.json?t=' + Date.now();
const webhookURL = 'https://discord.com/api/webhooks/1421356441633034345/6eYT-diTzt1Tb4hJxqHHK8UmBdqYB1mXeFkgNgjXfpuNZs-RvegE-nMFpW9wrHveanT6';

fetch(jsonURL)
  .then(res => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log('Fetched JSON:', data);

    // Unwrap if needed
    const options = Array.isArray(data) ? data : data.options;
    if (!Array.isArray(options)) {
      form.innerHTML = '<p>Invalid JSON format.</p>';
      return;
    }

    const hash = JSON.stringify(options);
    const storedHash = localStorage.getItem('voteHash');

    // Reset vote if JSON changed
    if (storedHash !== hash) {
      localStorage.removeItem('hasVoted');
      localStorage.setItem('voteHash', hash); // ✅ Move this BEFORE checking hasVoted
    }

    const hasVoted = localStorage.getItem('hasVoted') === 'true';

    if (options.length === 0) {
      form.innerHTML = '<p>No one to vote for!</p>';
      return;
    }

    if (hasVoted) {
      form.innerHTML = '<p>You already voted!</p>';
      return;
    }

    options.forEach(option => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="vote" value="${option}" /> ${option}`;
      form.appendChild(label);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit Vote';
    form.appendChild(button);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const vote = document.querySelector('input[name="vote"]:checked')?.value;
      if (!vote) {
        alert('Please select an option!');
        return;
      }

      localStorage.setItem('hasVoted', 'true');
      form.innerHTML = '';
      resultsDiv.innerHTML = `<p>Thanks for voting for <strong>${vote}</strong>!</p>`;

      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `🗳️ New vote: ${vote}` })
      });
    });
  })
  .catch(err => {
    form.innerHTML = '<p>Failed to load options.</p>';
    console.error('Error loading JSON:', err);
  });
