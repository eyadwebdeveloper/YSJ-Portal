document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.cl-checkbox input[type="checkbox"]');
    const sliders = document.querySelectorAll('.slider');

    // Function to toggle slider container visibility based on checkbox state
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const sliderId = checkbox.getAttribute('data-slider');
            const slider = document.getElementById(sliderId);

            if (slider) {
                slider.style.display = checkbox.checked ? 'block' : 'none';
            }
        });
    });

    // Function to update slider value display
    sliders.forEach(slider => {
        const outputId = slider.getAttribute('data-output');
        const output = document.getElementById(outputId);

        if (output) {
            output.textContent = slider.value;

            slider.addEventListener('input', function() {
                output.textContent = this.value;
            });
        }
    });
});