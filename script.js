const form = document.getElementById('voteForm');
const resultsDiv = document.getElementById('results');

const jsonURL = 'https://raw.githubusercontent.com/Kaytheprogrammingidiot/bv/refs/heads/main/v.json';
const webhookURL = 'https://discord.com/api/webhooks/1421356441633034345/6eYT-diTzt1Tb4hJxqHHK8UmBdqYB1mXeFkgNgjXfpuNZs-RvegE-nMFpW9wrHveanT6';

fetch(jsonURL)
  .then(res => res.json())
  .then(options => {
    const hash = JSON.stringify(options);
    const storedHash = localStorage.getItem('voteHash');
    const hasVoted = localStorage.getItem('hasVoted') === 'true';

    if (storedHash !== hash) {
      localStorage.setItem('voteHash', hash);
      localStorage.removeItem('hasVoted');
    }

    if (!Array.isArray(options) || options.length === 0) {
      form.innerHTML = '<p>No one to vote for!</p>';
      return;
    }

    if (localStorage.getItem('hasVoted') === 'true') {
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
      if (!vote) return alert('Please select an option!');

      localStorage.setItem('hasVoted', 'true');
      form.innerHTML = '';
      resultsDiv.innerHTML = `<p>Thanks for voting for <strong>${vote}</strong>!</p>`;

      // Send vote to Discord webhook
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `🗳️ New vote: ${vote}` })
      });
    });
  })
  .catch(err => {
    form.innerHTML = '<p>Failed to load options.</p>';
    console.error(err);
  });
