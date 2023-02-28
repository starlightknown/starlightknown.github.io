window.addEventListener('load', function () {
    // Get terminal elements
    const terminal = document.querySelector('.terminal');
    const promptText = document.querySelector('.prompt-text');
    const closeButton = document.querySelector('.close-button');
    const minimizeButton = document.querySelector('.minimize-button');
    const expandButton = document.querySelector('.expand-button');
  
    
    // Function to append text to the terminal output
    function appendToTerminalOutput(text) {
      const output = document.querySelector('.terminal-output');
      const p = document.createElement('p');
      p.innerText = text;
      output.appendChild(p);
      output.scrollTop = output.scrollHeight;
    }
  
    // Function to handle user input
    function handleUserInput(input) {
      const command = input.trim().toLowerCase();

      const output = document.querySelector('.terminal-output');
const p = document.createElement('p');
p.innerText = '> ' + input;
output.appendChild(p);
  
      switch (command) {
        case 'help':
          appendToTerminalOutput('Available commands:');
          appendToTerminalOutput('help - show a list of available commands');
          appendToTerminalOutput('about - show information about the terminal');
          appendToTerminalOutput('projects - show a list of my projects');
          appendToTerminalOutput('contact - show my contact information');
          break;
        case 'about':
          appendToTerminalOutput('This is a simple terminal-like portfolio website.');
          break;
        case 'projects':
          appendToTerminalOutput('My projects:');
          appendToTerminalOutput('- Project 1');
          appendToTerminalOutput('- Project 2');
          appendToTerminalOutput('- Project 3');
          break;
        case 'contact':
          appendToTerminalOutput('My contact information:');
          appendToTerminalOutput('- Email: email@example.com');
          appendToTerminalOutput('- Phone: 123-456-7890');
          appendToTerminalOutput('- Website: example.com');
          break;
        case 'clear':
          document.querySelector('.terminal-output').innerHTML = '';
          break;
        default:
          appendToTerminalOutput(`Command '${command}' not found. Type 'help' for a list of available commands.`);
          break;
      }
    }
  
    // Add event listener to prompt text input
    promptText.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleUserInput(event.target.value);
        event.target.value = '';
      }
    });
  
    // Add event listeners to buttons
    let terminalClosed = false;

closeButton.addEventListener('click', function () {
    terminalClosed = true;
    terminal.style.display = 'none';
});

minimizeButton.addEventListener('click', function () {
    terminal.style.height = '20px';
    terminal.style.overflowY = 'hidden';
    terminal.style.bottom = '0';
    terminal.style.transform = 'translate(-50%, 0)';
});

expandButton.addEventListener('click', function () {
    terminal.style.height = '400px';
    terminal.style.overflowY = 'scroll';
    terminal.style.bottom = '50%';
    terminal.style.transform = 'translate(-50%, -50%)';
  });
  
  
  

promptText.addEventListener('click', function () {
    if (terminalClosed) {
        terminalClosed = false;
        terminal.style.display = 'block';
    }
});

  });
  