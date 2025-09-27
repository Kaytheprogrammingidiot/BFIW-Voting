const form = document.getElementById('voteForm');
const resultsDiv = document.getElementById('results');

// Your GitHub raw JSON URL
const jsonURL = 'https://raw.githubusercontent.com/Kaytheprogrammingidiot/bv/refs/heads/main/v.json';

// Utility: create a simple hash from the JSON array
function hashOptions(options) {
  return JSON.stringify(options);
}

fetch(jsonURL)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(options => {
    const currentHash = hashOptions(options);
    const storedHash = localStorage.getItem('voteHash');
    const hasVoted = localStorage.getItem('hasVoted') === 'true';

    // If JSON changed, reset vote
    if (storedHash !== currentHash) {
      localStorage.setItem('voteHash', currentHash);
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const vote = document.querySelector('input[name="vote"]:checked')?.value;
      if (!vote) {
        alert('Please select an option!');
        return;
      }

      localStorage.setItem('hasVoted', 'true');
      resultsDiv.innerHTML = `<p>Thanks for voting for <strong>${vote}</strong>!</p>`;
      form.innerHTML = ''; // Clear form
    });
  })
  .catch(error => {
    form.innerHTML = '<p>Failed to load options.</p>';
    console.error('Error loading JSON:', error);
  });
