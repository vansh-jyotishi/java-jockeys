// Backend API logic - PRESERVED EXACTLY
function runCode() {
    const code = document.getElementById("code").value;
    const output = document.getElementById("result");
    const statusBar = document.getElementById("compileStatus");
    const runBtn = document.querySelector('.run-btn');

    // UI Feedback
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="loading"></span>Compiling...';
    statusBar.textContent = "Compiling...";
    statusBar.style.color = "white";
    output.textContent = "Initializing compiler...\nSending code to server...";
    output.className = "output-text";

    // ORIGINAL BACKEND CALL - UNCHANGED
    fetch("https://localhost:8080/compile", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: code
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.text();
    })
    .then(data => {
        output.textContent = data;
        output.className = "output-text success";
        statusBar.textContent = "Success";
        statusBar.style.color = "#89d185";
    })
    .catch(err => {
        output.textContent = `Error: ${err.message}\n\nMake sure the backend server is running on localhost:8080`;
        output.className = "output-text error";
        statusBar.textContent = "Error";
        statusBar.style.color = "#f48771";
    })
    .finally(() => {
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="run-icon">▶</span><span class="run-text">Run</span>';
    });
}

// Syntax Highlighting
function updateHighlight() {
    const code = document.getElementById('code').value;
    const highlighted = document.getElementById('codeHighlighted');
    
    // Escape HTML
    const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    highlighted.innerHTML = escaped;
    Prism.highlightElement(highlighted);
}

// UI Helper functions
function updateLineNumbers() {
    const textarea = document.getElementById('code');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n').length;
    
    const numbers = [];
    for (let i = 1; i <= lines; i++) {
        numbers.push(i);
    }
    lineNumbers.innerHTML = numbers.join('<br>');
}

function updateCursorPosition() {
    const textarea = document.getElementById('code');
    const cursorPos = document.getElementById('cursorPos');
    const text = textarea.value.substr(0, textarea.selectionStart);
    const line = text.split('\n').length;
    const col = text.split('\n').pop().length + 1;
    cursorPos.textContent = `Ln ${line}, Col ${col}`;
}

function syncScroll() {
    const wrapper = document.getElementById('editorWrapper');
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.scrollTop = wrapper.scrollTop;
}

function clearOutput() {
    const output = document.getElementById('result');
    output.textContent = "Ready to compile. Click Run to execute your Java program...";
    output.className = "output-text";
    document.getElementById('compileStatus').textContent = "Idle";
    document.getElementById('compileStatus').style.color = "white";
}

function resetCode() {
    const defaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;
    document.getElementById('code').value = defaultCode;
    updateLineNumbers();
    updateCursorPosition();
    updateHighlight();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('code');
    const wrapper = document.getElementById('editorWrapper');
    
    // Input handling
    textarea.addEventListener('input', function() {
        updateLineNumbers();
        updateHighlight();
    });
    
    // Scroll sync - wrapper scrolls both layers together
    wrapper.addEventListener('scroll', syncScroll, { passive: true });
    
    // Cursor tracking
    textarea.addEventListener('keyup', updateCursorPosition);
    textarea.addEventListener('click', updateCursorPosition);
    textarea.addEventListener('select', updateCursorPosition);
    
    // Tab key support
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const spaces = '    ';
            this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + spaces.length;
            updateLineNumbers();
            updateHighlight();
        }
        
        // Run shortcut (Ctrl/Cmd + Enter)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
    });
    
    // Initialize
    updateLineNumbers();
    updateCursorPosition();
    updateHighlight();
    
    // Ensure sync after fonts load
    document.fonts.ready.then(function() {
        updateHighlight();
    });
});