// BOOTSTRAP JAVASCRIPT CODE TO DISABLE FORM SUBMISSIONS IF THERE ARE INVALID FIELDS
(function () {
    'use strict';

    // FETCH ALL THE FORMS WE WANT TO APPLY CUSTOM BOOTSTRAP VALIDATION STYLES TO
    const forms = document.querySelectorAll('.needs-validation');

    // LOOP OVER THEM AND PREVENT DEFAULT SUBMISSION BEHAVIOUR.
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
})();