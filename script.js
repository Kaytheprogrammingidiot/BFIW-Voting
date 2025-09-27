const form = document.getElementById('voteForm');
const resultsDiv = document.getElementById('results');

// Your GitHub raw JSON URL
const jsonURL = 'https://raw.githubusercontent.com/Kaytheprogrammingidiot/bv/refs/heads/main/v.json';

// Check if user has already voted
const hasVoted = localStorage.getItem('hasVoted') === 'true';

if (hasVoted) {
  form.innerHTML = '<p>You already voted!</p>';
} else {
  fetch(jsonURL)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(options => {
      if (!Array.isArray(options) || options.length === 0) {
        form.innerHTML = '<p>No one to vote for!</p>';
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
    })
    .catch(error => {
      form.innerHTML = '<p>Failed to load options.</p>';
      console.error('Error loading JSON:', error);
    });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const vote = document.querySelector('input[name="vote"]:checked')?.value;
    if (!vote) {
      alert('Please select an option!');
      return;
    }

    localStorage.setItem('hasVoted', 'true');
    form.innerHTML = ''; // Clear form after voting
    resultsDiv.innerHTML = `<p>Thanks for voting for <strong>${vote}</strong>!</p>`;
  });
}
