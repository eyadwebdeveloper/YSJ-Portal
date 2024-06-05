document.addEventListener("DOMContentLoaded", function () {
  let slider = document.getElementById("myRange");
  let output = document.getElementById("sliderValue");
  output.textContent = slider.value;

  slider.oninput = function () {
    output.textContent = this.value;
  };
});

document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.cl-checkbox input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const sliderId = checkbox.getAttribute('data-slider');
            const slider = document.getElementById(sliderId);

            if (checkbox.checked) {
                slider.style.display = 'block';
            } else {
                slider.style.display = 'none';
            }
        });

        // Initialize the slider display state based on the checkbox
        const sliderId = checkbox.getAttribute('data-slider');
        const slider = document.getElementById(sliderId);
        if (checkbox.checked) {
            slider.style.display = 'block';
        } else {
            slider.style.display = 'none';
        }
    });
});
