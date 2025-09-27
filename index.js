const form = document.getElementById('voteForm');
const resultsDiv = document.getElementById('results');
const jsonURL = 'https://raw.githubusercontent.com/your-username/your-repo/main/vote-options.json';

let hasVoted = false;

fetch(jsonURL)
  .then(response => response.json())
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
  if (hasVoted) {
    resultsDiv.innerHTML = '<p>You already voted!</p>';
    return;
  }

  const vote = form.vote.value;
  if (!vote) {
    alert('Please select an option!');
    return;
  }

  hasVoted = true;
  resultsDiv.innerHTML = `<p>Thanks for voting for <strong>${vote}</strong>!</p>`;
});
