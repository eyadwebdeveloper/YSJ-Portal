document.addEventListener('DOMContentLoaded', function() {
    const topics = ['Astronomy', 'Architecture', 'Biology', 'Business', 'Chemistry', 'Computer Science', 'Engineering', 'Environmental Studies', 'Mathematics', 'Neuroscience', 'Physics', 'Political Science', 'Psychology'];

    const checkboxesContainer = document.getElementById('checkboxes-container');

    // Create checkboxes, sliders, and textareas dynamically
    topics.forEach((topic, index) => {
        const checkboxId = `checkbox-${index}`;
        const sliderId = `slider-${index}`;
        const textareaId = `textarea-${index}`;

        // Create checkbox
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('cl-checkbox');
        checkboxLabel.innerHTML = `
            <input type="checkbox" id="${checkboxId}" class="checkbox">
            <span>${topic}</span>
        `;
        checkboxesContainer.appendChild(checkboxLabel);

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');
        sliderContainer.id = sliderId;
        sliderContainer.innerHTML = `
            <input type="range" min="0" max="10" value="1" class="slider">
            <p>Value: <span class="slider-value">1</span></p>
        `;
        checkboxesContainer.appendChild(sliderContainer);

        // Create textarea container
        const textareaContainer = document.createElement('div');
        textareaContainer.classList.add('textarea-container');
        textareaContainer.id = textareaId;
        textareaContainer.innerHTML = `
            <label for="${textareaId}">Comments:</label>
            <textarea id="${textareaId}" class="textarea" rows="4" cols="50"></textarea>
        `;
        checkboxesContainer.appendChild(textareaContainer);

        // Set initial state
        const checkbox = document.getElementById(checkboxId);
        const slider = sliderContainer.querySelector('.slider');
        const textarea = textareaContainer.querySelector('.textarea');
        sliderContainer.style.display = checkbox.checked ? 'block' : 'none';
        textareaContainer.style.display = checkbox.checked ? 'block' : 'none';

        // Toggle slider container and textarea visibility based on checkbox state
        checkbox.addEventListener('change', function() {
            sliderContainer.style.display = checkbox.checked ? 'block' : 'none';
            textareaContainer.style.display = checkbox.checked ? 'block' : 'none';
        });

        // Update slider value display
        const output = sliderContainer.querySelector('.slider-value');
        slider.addEventListener('input', function() {
            output.textContent = this.value;
        });
    });
});