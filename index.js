document.addEventListener('DOMContentLoaded', function() {
    const topics = ['Astronomy', 'Architecture', 'Biology', 'Business', 'Chemistry', 'Computer Science', 'Engineering', 'Environmental Studies', 'Mathematics', 'Neuroscience', 'Physics', 'Political Science', 'Psychology'];

    const checkboxesContainer = document.getElementById('checkboxes-container');

    // Create checkboxes and sliders dynamically
    topics.forEach((topic, index) => {
        const checkboxId = `checkbox-${index}`;
        const sliderId = `slider-${index}`;

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

        // Set initial state
        const checkbox = document.getElementById(checkboxId);
        const slider = sliderContainer.querySelector('.slider');
        sliderContainer.style.display = checkbox.checked ? 'block' : 'none';

        // Toggle slider container visibility based on checkbox state
        checkbox.addEventListener('change', function() {
            sliderContainer.style.display = checkbox.checked ? 'block' : 'none';
        });

        // Update slider value display
        const output = sliderContainer.querySelector('.slider-value');
        slider.addEventListener('input', function() {
            output.textContent = this.value;
        });
    });
});