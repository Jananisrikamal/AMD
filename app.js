/**
 * PerceptaLearn AI - Core Logic
 */

class AppController {
    constructor() {
        this.currentScreen = 'welcome';
        this.screens = [
            'welcome', 'dashboard', 'subject', 'chapter', 
            'lesson', 'quiz', 'feedback', 'explain-back', 'summary'
        ];
        
        // Quiz State
        this.selectedOption = null;
        this.selectedBtn = null;
        this.isCorrect = false;
        
        // Voice Recording State
        this.isRecording = false;
        this.recordingTimer = null;
    }

    /**
     * Navigation Logic
     */
    navigate(targetScreen, context = null) {
        // Hide all screens
        this.screens.forEach(id => {
            const el = document.getElementById(`screen-${id}`);
            if (el) {
                el.classList.remove('active');
                el.classList.add('hidden');
            }
        });

        // Show target screen
        const targetEl = document.getElementById(`screen-${targetScreen}`);
        if (targetEl) {
            targetEl.classList.remove('hidden');
            // Small delay for transition effect
            setTimeout(() => {
                targetEl.classList.add('active');
            }, 50);
        }
        
        this.currentScreen = targetScreen;
        
        // Handle specific entry logic
        if (targetScreen === 'quiz') {
            this.initQuiz(context);
        } else if (targetScreen === 'explain-back') {
            this.resetRecordingUI();
        }
    }

    /**
     * Quiz Logic
     */
    initQuiz(context) {
        // Reset selections
        this.selectedOption = null;
        this.selectedBtn = null;
        
        const optionsList = document.getElementById('options-list');
        const btns = optionsList.querySelectorAll('.option-btn');
        btns.forEach(b => {
            b.classList.remove('selected', 'correct', 'wrong');
        });
        
        const submitBtn = document.getElementById('submit-answer-btn');
        submitBtn.classList.add('disabled');
        
        // Context specific changes
        if (context === 'retest') {
            document.getElementById('question-text').innerText = "Let's try again: What are the primary inputs required for photosynthesis?";
            document.getElementById('quiz-progress').style.width = '66%';
        } else {
            document.getElementById('question-text').innerText = "What are the primary inputs required for photosynthesis?";
            document.getElementById('quiz-progress').style.width = '33%';
        }
    }

    selectOption(btnElement, letter) {
        // Clear previous selection
        const optionsList = document.getElementById('options-list');
        const btns = optionsList.querySelectorAll('.option-btn');
        btns.forEach(b => b.classList.remove('selected'));
        
        // Set new selection
        btnElement.classList.add('selected');
        this.selectedOption = letter;
        this.selectedBtn = btnElement;
        
        // Enable submit button
        document.getElementById('submit-answer-btn').classList.remove('disabled');
    }

    submitAnswer() {
        if (!this.selectedOption) return;
        
        // Mock Evaluation: B is correct.
        this.isCorrect = (this.selectedOption === 'B');
        
        this.showFeedback();
    }

    /**
     * Feedback Logic
     */
    showFeedback() {
        const titleEl = document.getElementById('feedback-title');
        const subtitleEl = document.getElementById('feedback-subtitle');
        const iconContainer = document.getElementById('feedback-icon-container');
        const iconEl = document.getElementById('feedback-icon');
        const explanationBox = document.getElementById('feedback-explanation-box');
        const nextBtn = document.getElementById('feedback-next-btn');
        
        if (this.isCorrect) {
            // Correct State
            iconContainer.className = 'feedback-icon-lg mb-lg safe-bg-green text-green';
            iconEl.innerText = 'check_circle';
            
            titleEl.innerText = 'Excellent work!';
            subtitleEl.innerText = "You've understood this concept well.";
            
            explanationBox.classList.add('hidden');
            
            nextBtn.innerText = 'Next Question / Summary';
            nextBtn.onclick = () => this.navigate('summary');
        } else {
            // Wrong State
            iconContainer.className = 'feedback-icon-lg mb-lg safe-bg-red text-red';
            iconEl.innerText = 'lightbulb'; // Softer icon for wrong answers
            
            titleEl.innerText = 'Good try!';
            subtitleEl.innerText = "Let's understand this together.";
            
            explanationBox.classList.remove('hidden');
            
            nextBtn.innerText = 'Explain in Your Own Words';
            nextBtn.onclick = () => this.navigate('explain-back');
        }
        
        this.navigate('feedback');
    }

    /**
     * Explain-Back Voice Logic
     */
    resetRecordingUI() {
        this.isRecording = false;
        
        const micBtn = document.getElementById('mic-btn');
        const statusText = document.getElementById('recording-status');
        const waves = document.getElementById('recording-waves');
        const submitBtn = document.getElementById('submit-explanation-btn');
        const overlay = document.getElementById('ai-processing-overlay');
        
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<span class="material-symbols-rounded">mic</span>';
        
        statusText.innerText = 'Tap to start recording';
        waves.classList.add('hidden');
        submitBtn.classList.add('disabled');
        overlay.classList.add('hidden');
    }

    toggleRecording() {
        const micBtn = document.getElementById('mic-btn');
        const statusText = document.getElementById('recording-status');
        const waves = document.getElementById('recording-waves');
        const submitBtn = document.getElementById('submit-explanation-btn');
        
        if (!this.isRecording) {
            // Start recording
            this.isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<span class="material-symbols-rounded">stop</span>';
            
            statusText.innerText = 'Listening to you...';
            waves.classList.remove('hidden');
            
            // Auto stop/enable submit after small delay for demo
            setTimeout(() => {
                submitBtn.classList.remove('disabled');
            }, 2000);
            
        } else {
            // Stop recording
            this.isRecording = false;
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<span class="material-symbols-rounded">mic</span>';
            
            statusText.innerText = 'Recording saved. Ready to submit.';
            waves.classList.add('hidden');
        }
    }

    submitExplanation() {
        // Show AI processing overlay
        const overlay = document.getElementById('ai-processing-overlay');
        overlay.classList.remove('hidden');
        
        // Simulate AI logic processing time
        setTimeout(() => {
            overlay.classList.add('hidden');
            // Navigate back to the quiz for re-testing
            this.navigate('quiz', 'retest');
        }, 2500);
    }
}

// Initialize application
const app = new AppController();
